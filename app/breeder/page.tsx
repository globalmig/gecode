import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import { breadcrumbJsonLd, breederCollectionJsonLd } from "@/lib/seo/jsonld";
import BreederBrowser from "@/components/breeder/BreederBrowser";
import { listBreeders } from "@/lib/breeders/queries";
import type { Breeder } from "@/lib/breeders/types";

// 공개 개체 목록은 로그인 세션 쿠키를 읽는 Supabase 클라이언트로 매 요청 조회하므로 정적 프리렌더 대상에서 제외한다.
export const instant = false;

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

export default async function BreederPage() {
  let breeders: Breeder[] = [];
  let loadError: string | null = null;

  try {
    breeders = await listBreeders();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "개체 목록을 불러오는 중 오류가 발생했습니다.";
  }

  return (
    <div className="mx-auto flex max-w-360 flex-col gap-10 px-5 py-16 sm:py-20 lg:py-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "브리더 소개", path: "/breeder" },
          ]),
          breederCollectionJsonLd(),
        ]}
      />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl lg:text-[40px]">
          입양한 개체의 부모가
          <br />
          궁금하다면?
        </h1>
        <p className="text-base text-black/60 sm:text-lg">
          아래의 검색 탭에서 브리더 이름과
          <br className="hidden sm:block" />
          조건을 선택하면 바로 조회할 수 있습니다.
        </p>
      </div>

      {loadError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center text-sm text-red-700">
          {loadError}
        </p>
      ) : (
        <BreederBrowser entries={breeders} />
      )}
    </div>
  );
}
