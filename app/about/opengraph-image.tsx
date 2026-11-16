import { buildOgImage, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "게코드 소개";

export default function Image() {
  return buildOgImage("게코드 소개", "왜 게코드를 믿고 선택해야 하는가");
}
