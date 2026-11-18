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

  let imageUrl: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      imageUrl = await uploadImage(supabase, file);
    } catch (error) {
      return { error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." };
    }
  }

  const { name, englishName, gender, morph, fatherName, motherName, description, displayOrder, isPublished } =
    parsed.data;

  const { error } = await supabase.from("breeders").insert({
    name,
    english_name: englishName,
    gender,
    morph,
    father_name: fatherName,
    mother_name: motherName,
    description,
    display_order: displayOrder,
    is_published: isPublished,
    image_url: imageUrl,
  });

  if (error) {
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

  let imageUrl = existing?.image_url ?? null;
  const file = formData.get("image");
  const removeExisting = formData.get("removeImage") === "on";

  if (file instanceof File && file.size > 0) {
    try {
      const newImageUrl = await uploadImage(supabase, file);
      await removeImage(supabase, imageUrl);
      imageUrl = newImageUrl;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." };
    }
  } else if (removeExisting && imageUrl) {
    await removeImage(supabase, imageUrl);
    imageUrl = null;
  }

  const { name, englishName, gender, morph, fatherName, motherName, description, displayOrder, isPublished } =
    parsed.data;

  const { error } = await supabase
    .from("breeders")
    .update({
      name,
      english_name: englishName,
      gender,
      morph,
      father_name: fatherName,
      mother_name: motherName,
      description,
      display_order: displayOrder,
      is_published: isPublished,
      image_url: imageUrl,
    })
    .eq("id", id);

  if (error) {
    return { error: `수정에 실패했습니다: ${error.message}` };
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
