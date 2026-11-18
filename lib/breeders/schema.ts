import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullable()
    .transform((value) => (value ? value : null));

export const breederFormSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요.").max(50, "50자 이내로 입력해주세요."),
  englishName: optionalText(50),
  gender: z.enum(["male", "female", "unknown"]),
  morph: optionalText(50),
  fatherName: optionalText(50),
  motherName: optionalText(50),
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
    morph: formData.get("morph"),
    fatherName: formData.get("fatherName"),
    motherName: formData.get("motherName"),
    description: formData.get("description"),
    displayOrder: formData.get("displayOrder") || 0,
    isPublished: formData.get("isPublished") === "on",
  });
}
