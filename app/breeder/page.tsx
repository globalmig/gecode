import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import { breadcrumbJsonLd, breederCollectionJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "브리더 소개",
  description:
    "이름과 성별, 부모 개체로 게코드의 크레스티드 게코 브리더(개체)를 검색해보세요.",
  alternates: { canonical: "/breeder" },
  openGraph: {
    title: `브리더 소개 | ${siteConfig.name}`,
    description:
      "이름과 성별, 부모 개체로 게코드의 크레스티드 게코 브리더(개체)를 검색해보세요.",
    url: "/breeder",
  },
};

export default function BreederPage() {
  return (
    <div className="mx-auto flex max-w-360 flex-col gap-6 px-5 py-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "브리더 소개", path: "/breeder" },
          ]),
          breederCollectionJsonLd(),
        ]}
      />
      <h1 className="text-2xl font-bold sm:text-3xl">브리더 소개</h1>
      <p className="text-base text-foreground/70">
        입양한 개체의 부모가 궁금하다면, 이름과 조건으로 우리 개체들을
        찾아보세요.
      </p>
      {/* TODO: 검색 탭(이름 검색 + 성별/부모개체 필터)과 브리더 카드 목록은
        content-plan.md의 "브리더 소개" 섹션 원고/사진 확정 후 구현합니다. */}
    </div>
  );
}
