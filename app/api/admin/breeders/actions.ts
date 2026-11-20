"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseBreederFormData, type BreederFormState } from "@/lib/breeders/schema";

const BUCKET = "breeders";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return supabase;
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "사진을 등록해주세요." };
  }

  let imageUrl: string | null = null;
  try {
    imageUrl = await uploadImage(supabase, file);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." };
  }

  const { name, englishName, gender, stage, morph, fatherId, motherId, description, displayOrder, isPublished } =
    parsed.data;

  const { error } = await supabase.from("breeders").insert({
    name,
    english_name: englishName,
    gender,
    stage,
    morph,
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
  const file = formData.get("image");

  if (file instanceof File && file.size > 0) {
    try {
      uploadedImageUrl = await uploadImage(supabase, file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." };
    }
    imageUrl = uploadedImageUrl;
  }

  if (!imageUrl) {
    if (uploadedImageUrl) await removeImage(supabase, uploadedImageUrl);
    return { error: "사진을 등록해주세요." };
  }

  const { name, englishName, gender, stage, morph, fatherId, motherId, description, displayOrder, isPublished } =
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
