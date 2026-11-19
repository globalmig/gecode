import { buildOgImage, ogImageContentType, ogImageSize } from "@/lib/seo/og-image";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "FAQ - 게코드";

export default function Image() {
  return buildOgImage("FAQ", "자주 묻는 질문을 모아 안내해 드립니다");
}
