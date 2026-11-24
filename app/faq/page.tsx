import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import FaqAccordion from "@/components/domain/FaqAccordion";
import { siteConfig, ogImages } from "@/lib/seo/config";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { FAQ_CATEGORIES } from "./content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "분양 문의, 배송과 직거래, 혈통과 모프, 건강보증·교환·환불까지 게코드에 자주 묻는 질문을 모았습니다.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: `FAQ | ${siteConfig.name}`,
    description:
      "분양 문의, 배송과 직거래, 혈통과 모프, 건강보증·교환·환불까지 게코드에 자주 묻는 질문을 모았습니다.",
    url: "/faq",
    images: ogImages("FAQ"),
  },
};

export default function FaqPage() {
  const allItems = FAQ_CATEGORIES.flatMap((category) => category.items);

  return (
    <div className="mx-auto flex max-w-360 flex-col gap-10 px-5 py-16 sm:gap-12 sm:py-20 lg:py-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqPageJsonLd(allItems),
        ]}
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-[40px]">
          자주 묻는 질문
        </h1>
        <p className="max-w-2xl text-base text-black sm:text-lg">
          분양 문의부터 배송·직거래, 건강보증과 교환·환불까지, 많이 물어주신 질문을 모아 안내해
          드립니다. 찾으시는 답변이 없다면 카카오톡이나 전화로 편하게 문의해 주세요.
        </p>
      </div>

      <FaqAccordion categories={FAQ_CATEGORIES} />
    </div>
  );
}
