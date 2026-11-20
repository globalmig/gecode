export type BreederGender = "male" | "female" | "unknown";
export type BreederStage = "adult" | "baby";

export type Breeder = {
  id: string;
  name: string;
  english_name: string | null;
  gender: BreederGender;
  stage: BreederStage;
  morph: string | null;
  father_id: string | null;
  mother_id: string | null;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// 부/모 개체 갤러리 선택 목록, 상세페이지 링크용으로 쓰는 축약 정보
export type BreederOption = {
  id: string;
  name: string;
  english_name: string | null;
  image_url: string | null;
  gender: BreederGender;
  stage: BreederStage;
};

export type BreederWithParents = Breeder & {
  father: BreederOption | null;
  mother: BreederOption | null;
};

export const genderLabel: Record<BreederGender, string> = {
  male: "수컷",
  female: "암컷",
  unknown: "미구분",
};

export const stageLabel: Record<BreederStage, string> = {
  adult: "성체",
  baby: "베이비",
};
