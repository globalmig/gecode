import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "게코드 소개",
  description:
    "게코드의 브리딩 철학과 사육 시설을 소개합니다. 왜 게코드를 믿고 선택해야 하는지 확인하세요.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `게코드 소개 | ${siteConfig.name}`,
    description:
      "게코드의 브리딩 철학과 사육 시설을 소개합니다. 왜 게코드를 믿고 선택해야 하는지 확인하세요.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex max-w-300 flex-col gap-6 px-5 py-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "게코드 소개", path: "/about" },
          ]),
          aboutPageJsonLd(),
        ]}
      />
      <h1 className="text-2xl font-bold sm:text-3xl">게코드 소개</h1>
      <p className="text-base text-foreground/70">
        왜 게코드를 믿고 선택해야 하는지, 브리딩 철학과 사육 환경을
        소개합니다.
      </p>
      {/* TODO: 브리딩 철학/업체 소개 원고와 시설 사진은 content-plan.md
        "크레요트" 섹션 검토 요청 항목 확정 후 구현합니다. */}
    </div>
  );
}
