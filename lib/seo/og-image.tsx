import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

const BRAND_YELLOW = "#ffd900";
const BRAND_INK = "#0c0c0c";

/**
 * 공유 OG 이미지 생성기. 실제 브랜드 사진이 준비되기 전까지 사용하는
 * 텍스트 기반 placeholder이며, globals.css의 brand 토큰 색상을 그대로 사용한다.
 */
export function buildOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BRAND_INK,
          color: "#ffffff",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: BRAND_YELLOW,
            letterSpacing: "0.02em",
          }}
        >
          GECODE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)" }}>{subtitle}</div>
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
