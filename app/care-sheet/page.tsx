import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import CareSheetTabs from "@/components/domain/CareSheetTabs";
import { siteConfig, ogImages } from "@/lib/seo/config";
import { breadcrumbJsonLd, careSheetArticleJsonLd } from "@/lib/seo/jsonld";
import { CARE_SHEET_SECTIONS, CARE_SHEET_SUMMARY_STATS } from "./content";

export const metadata: Metadata = {
  title: "케어시트",
  description:
    "기본 환경부터 먹이, 위생, 번식, 핸들링까지 크레스티드 게코 사육에 필요한 모든 정보를 확인하세요.",
  alternates: { canonical: "/care-sheet" },
  openGraph: {
    title: `케어시트 | ${siteConfig.name}`,
    description:
      "기본 환경부터 먹이, 위생, 번식, 핸들링까지 크레스티드 게코 사육에 필요한 모든 정보를 확인하세요.",
    url: "/care-sheet",
    images: ogImages("케어시트"),
  },
};

const ADOPTION_CHECKLIST = [
  {
    image: "/images/care-sheet/enclosure.png",
    title: "사육장과 구조물",
    description: "환기구, 올라갈 곳, 몸을 받칠 자리를 확인하세요.",
  },
  {
    image: "/images/care-sheet/water-bowl.png",
    title: "물그릇과 분무기",
    description: "마실 물과 사육장 수분을 따로 챙겨요.",
  },
  {
    image: "/images/care-sheet/substrate.png",
    title: "백업과 바닥재",
    description: "높은 곳에도 몸을 받칠 자리와 청소하기 쉬운 바닥을 준비해요.",
  },
  {
    image: "/images/care-sheet/thermometer.png",
    title: "디지털 온습도계",
    description: "개체가 생활하는 자리의 온습도를 확인해요.",
  },
  {
    image: "/images/care-sheet/food.png",
    title: "전용 사료와 먹이 그릇",
    description: "먹이는 제품 안내에 맞춰 준비해요.",
  },
] as const;

export default function CareSheetPage() {
  return (
    <div className="mx-auto flex max-w-360 flex-col gap-14 px-5 py-16 sm:gap-16 sm:py-20 lg:gap-20 lg:py-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "케어시트", path: "/care-sheet" },
          ]),
          careSheetArticleJsonLd(),
        ]}
      />

      <div className="flex flex-col gap-10 sm:gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-[40px]">
            처음 준비할 것부터
            <br />
            매일 살펴볼 것 까지
          </h1>
          <p className="max-w-2xl text-base text-black sm:text-lg">
            오랜 관찰과 꾸준한 기록을 바탕으로, 사육 환경부터 먹이와 건강
            관리, 핸들링과 번식까지 필요한 정보를 정리했습니다.
          </p>
        </div>

        {/* speakable 대상: AEO 대응을 위한 기본 관리 요약 수치 */}
        {/* <div
          id="care-summary"
          className="flex w-full flex-wrap gap-x-8 gap-y-4 rounded-lg border border-black/10 p-6 sm:w-auto"
        >
          {CARE_SHEET_SUMMARY_STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <p className="text-sm text-black/60">{stat.label}</p>
              <p className="text-lg font-semibold sm:text-xl">{stat.value}</p>
            </div>
          ))}
        </div> */}
      </div>

      <CareSheetTabs
        sections={CARE_SHEET_SECTIONS}
        adoptionChecklist={ADOPTION_CHECKLIST}
      />
    </div>
  );
}
