import { createClient } from "@/lib/supabase/server";
import type { Breeder, BreederOption, BreederWithParents } from "./types";

const OPTION_COLUMNS = "id,name,english_name,image_url,gender,stage";

export async function listBreeders(): Promise<Breeder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeders")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`브리더 목록을 불러오지 못했습니다: ${error.message}`);
  }

  return data as Breeder[];
}

export async function listBreedersPage(
  page: number,
  pageSize: number,
): Promise<{ breeders: Breeder[]; total: number }> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("breeders")
    .select("*", { count: "exact" })
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`브리더 목록을 불러오지 못했습니다: ${error.message}`);
  }

  return { breeders: data as Breeder[], total: count ?? 0 };
}

export async function listBreederPreviews(limit: number): Promise<Breeder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeders")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`브리더 목록을 불러오지 못했습니다: ${error.message}`);
  }

  return data as Breeder[];
}

export async function listBreederOptions(excludeId?: string): Promise<BreederOption[]> {
  const supabase = await createClient();
  let query = supabase
    .from("breeders")
    .select(OPTION_COLUMNS)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (excludeId) {
    query = query.neq("id", excludeId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`개체 목록을 불러오지 못했습니다: ${error.message}`);
  }

  return data as BreederOption[];
}

export async function getBreeder(id: string): Promise<BreederWithParents | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`브리더 정보를 불러오지 못했습니다: ${error.message}`);
  }

  if (!data) return null;

  const entry = data as Breeder;
  const parentIds = [entry.father_id, entry.mother_id].filter(
    (value): value is string => !!value,
  );

  let parents: BreederOption[] = [];
  if (parentIds.length > 0) {
    const { data: parentData, error: parentError } = await supabase
      .from("breeders")
      .select(OPTION_COLUMNS)
      .in("id", parentIds);

    if (parentError) {
      throw new Error(`부모 개체 정보를 불러오지 못했습니다: ${parentError.message}`);
    }
    parents = (parentData ?? []) as BreederOption[];
  }

  return {
    ...entry,
    father: entry.father_id ? parents.find((parent) => parent.id === entry.father_id) ?? null : null,
    mother: entry.mother_id ? parents.find((parent) => parent.id === entry.mother_id) ?? null : null,
  };
}
