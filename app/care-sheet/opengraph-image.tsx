import { buildOgImage, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "케어시트 - 게코드";

export default function Image() {
  return buildOgImage("케어시트", "처음 준비할 것부터 매일 살펴볼 것까지");
}
