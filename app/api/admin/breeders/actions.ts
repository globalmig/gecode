"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseBreederFormData, type BreederFormState } from "@/lib/breeders/schema";

const BUCKET = "breeders";
// createImageUploadTicket으로 발급한 경로만 허용한다(모두 "<uuid>.jpg" 형태).
// 실제 용량/형식 제한은 Supabase Storage 버킷 설정(file_size_limit, allowed_mime_types)에서 강제된다.
// supabase/migrations/0007_breeder_bucket_limits.sql 참고.
const IMAGE_PATH_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/i;

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return supabase;
}

/**
 * 브라우저가 Supabase Storage에 직접 업로드할 수 있도록 서명된 업로드 URL을 발급한다.
 * 실제 이미지 바이트는 이 서버(Vercel)를 거치지 않고 브라우저 → Supabase로 바로 전송되므로
 * 서버 액션/Vercel의 요청 본문 크기 제한과 무관하다.
 */
export async function createImageUploadTicket(): Promise<
  { path: string; token: string } | { error: string }
> {
  const supabase = await requireUser();
  const path = `${randomUUID()}.jpg`;

  const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    return { error: "업로드 준비에 실패했습니다." };
  }

  return { path: data.path, token: data.token };
}

function publicUrlFromPath(supabase: Awaited<ReturnType<typeof createClient>>, path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** 폼에 담긴 imagePath가 createImageUploadTicket이 발급한 형식인지 확인한다. */
function resolveImagePath(formData: FormData): string | null {
  const path = formData.get("imagePath");
  if (typeof path !== "string" || !IMAGE_PATH_PATTERN.test(path)) return null;
  return path;
}

function extractStoragePath(imageUrl: string | null) {
  if (!imageUrl) return null;
  const marker = `/${BUCKET}/`;
  const index = imageUrl.indexOf(marker);
  if (index === -1) return null;
  return imageUrl.slice(index + marker.length);
}

async function removeImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  imageUrl: string | null,
) {
  const path = extractStoragePath(imageUrl);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function createBreeder(
  _prevState: BreederFormState,
  formData: FormData,
): Promise<BreederFormState> {
  const supabase = await requireUser();
  const parsed = parseBreederFormData(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      error: "입력값을 확인해주세요.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]]),
      ),
    };
  }

  const imagePath = resolveImagePath(formData);
  if (!imagePath) {
    return { error: "사진을 등록해주세요." };
  }
  const imageUrl = publicUrlFromPath(supabase, imagePath);

  const { name, englishName, gender, stage, morph, price, fatherId, motherId, description, displayOrder, isPublished } =
    parsed.data;

  const { error } = await supabase.from("breeders").insert({
    name,
    english_name: englishName,
    gender,
    stage,
    morph,
    price,
    father_id: fatherId,
    mother_id: motherId,
    description,
    display_order: displayOrder,
    is_published: isPublished,
    image_url: imageUrl,
  });

  if (error) {
    // 등록이 실패했으므로 이미 올려둔 사진이 있다면 고아 파일로 남지 않도록 정리한다.
    await removeImage(supabase, imageUrl);
    return { error: `등록에 실패했습니다: ${error.message}` };
  }

  revalidatePath("/admin");
  revalidatePath("/breeder");
  return { success: true };
}

export async function updateBreeder(
  id: string,
  _prevState: BreederFormState,
  formData: FormData,
): Promise<BreederFormState> {
  const supabase = await requireUser();
  const parsed = parseBreederFormData(formData);

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      error: "입력값을 확인해주세요.",
      fieldErrors: Object.fromEntries(
        Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0]]),
      ),
    };
  }

  const { data: existing } = await supabase
    .from("breeders")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const previousImageUrl = existing?.image_url ?? null;
  let imageUrl = previousImageUrl;
  let uploadedImageUrl: string | null = null;
  const newImagePath = resolveImagePath(formData);

  if (newImagePath) {
    uploadedImageUrl = publicUrlFromPath(supabase, newImagePath);
    imageUrl = uploadedImageUrl;
  }

  if (!imageUrl) {
    if (uploadedImageUrl) await removeImage(supabase, uploadedImageUrl);
    return { error: "사진을 등록해주세요." };
  }

  const { name, englishName, gender, stage, morph, price, fatherId, motherId, description, displayOrder, isPublished } =
    parsed.data;

  if (fatherId === id || motherId === id) {
    if (uploadedImageUrl) await removeImage(supabase, uploadedImageUrl);
    return { error: "자기 자신을 부/모 개체로 선택할 수 없습니다." };
  }

  const { error } = await supabase
    .from("breeders")
    .update({
      name,
      english_name: englishName,
      gender,
      stage,
      morph,
      price,
      father_id: fatherId,
      mother_id: motherId,
      description,
      display_order: displayOrder,
      is_published: isPublished,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) {
    // DB 반영이 실패했으므로 기존 사진은 지우지 않고, 새로 올린 파일만 정리해 고아 파일을 남기지 않는다.
    if (uploadedImageUrl) await removeImage(supabase, uploadedImageUrl);
    return { error: `수정에 실패했습니다: ${error.message}` };
  }

  // DB가 새 image_url을 가리키도록 반영된 뒤에만 더 이상 쓰이지 않는 이전 사진을 스토리지에서 지운다.
  // (먼저 지우면 DB 업데이트가 실패할 때 참조는 남아있는데 파일만 사라지는 불일치가 생긴다.)
  if (imageUrl !== previousImageUrl && previousImageUrl) {
    await removeImage(supabase, previousImageUrl);
  }

  revalidatePath("/admin");
  revalidatePath("/breeder");
  return { success: true };
}

export async function deleteBreeder(id: string) {
  const supabase = await requireUser();

  const { data: existing } = await supabase
    .from("breeders")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("breeders").delete().eq("id", id);

  if (error) {
    throw new Error(`삭제에 실패했습니다: ${error.message}`);
  }

  if (existing?.image_url) {
    await removeImage(supabase, existing.image_url);
  }

  revalidatePath("/admin");
  revalidatePath("/breeder");
}
