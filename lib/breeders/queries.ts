import { createClient } from "@/lib/supabase/server";
import type { Breeder } from "./types";

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

export async function getBreeder(id: string): Promise<Breeder | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("breeders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`브리더 정보를 불러오지 못했습니다: ${error.message}`);
  }

  return data as Breeder | null;
}
