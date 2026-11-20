import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((value) => (value ? value : null));

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const optionalParentId = z
  .string()
  .trim()
  .nullable()
  .transform((value) => (value ? value : null))
  .refine((value) => value === null || UUID_PATTERN.test(value), {
    message: "선택한 개체 정보가 올바르지 않습니다.",
  });

export const breederFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요.").max(50, "50자 이내로 입력해주세요."),
  englishName: z.string().trim().min(1, "영문명을 입력해주세요.").max(50, "50자 이내로 입력해주세요."),
  gender: z.enum(["male", "female", "unknown"]),
  stage: z.enum(["adult", "baby"]),
  morph: optionalText(50),
  fatherId: optionalParentId,
  motherId: optionalParentId,
  description: optionalText(2000),
  displayOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean(),
});

export type BreederFormValues = z.infer<typeof breederFormSchema>;

export type BreederFormState = {
  error?: string;
  fieldErrors?: Partial<Record<keyof BreederFormValues, string>>;
  success?: boolean;
};

export function parseBreederFormData(formData: FormData) {
  return breederFormSchema.safeParse({
    name: formData.get("name"),
    englishName: formData.get("englishName"),
    gender: formData.get("gender"),
    stage: formData.get("stage"),
    morph: formData.get("morph"),
    fatherId: formData.get("fatherId"),
    motherId: formData.get("motherId"),
    description: formData.get("description"),
    displayOrder: formData.get("displayOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  });
}
