import type { NextConfig } from "next";

// 개발 모드(next dev)는 React가 서버 에러 스택을 재구성하는 데 eval을 쓰므로
// script-src에 'unsafe-eval'이 추가로 필요하다(프로덕션 빌드는 eval을 쓰지 않아 불필요).
const isDev = process.env.NODE_ENV === "development";

// Next.js App Router는 RSC 스트리밍 데이터를 전달하기 위해 모든 페이지에 인라인 스크립트
// (self.__next_f.push(...))를 반드시 삽입한다. nonce 기반 CSP로 이를 허용하려면 모든 페이지를
// 완전히 동적 렌더링해야 해서 cacheComponents(Partial Prerendering)와 충돌하므로,
// script-src에 'unsafe-inline'을 둔다(Next.js 공식 "Without Nonces" 가이드와 동일한 방식).
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
