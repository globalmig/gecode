export type BreederGender = "male" | "female" | "unknown";

export type Breeder = {
  id: string;
  name: string;
  english_name: string | null;
  gender: BreederGender;
  morph: string | null;
  father_name: string | null;
  mother_name: string | null;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const genderLabel: Record<BreederGender, string> = {
  male: "수컷",
  female: "암컷",
  unknown: "미구분",
};
