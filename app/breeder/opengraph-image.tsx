import { buildOgImage, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "브리더 소개 - 게코드";

export default function Image() {
  return buildOgImage("브리더 소개", "이름과 조건으로 찾아보는 우리 개체들");
}
