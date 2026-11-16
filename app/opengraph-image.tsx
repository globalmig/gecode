import { buildOgImage, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "게코드 - 신뢰할 수 있는 브리더, 함께 준비하는 사육 정보";

export default function Image() {
  return buildOgImage("게코드", "신뢰할 수 있는 브리더, 함께 준비하는 사육 정보");
}
