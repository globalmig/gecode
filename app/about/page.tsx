import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig, ogImages } from "@/lib/seo/config";
import { aboutPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import AboutIntro from "@/components/about/AboutIntro";
import AboutFeatures from "@/components/about/AboutFeatures";
import AboutFacility from "@/components/about/AboutFacility";
import AboutLocation from "@/components/about/AboutLocation";

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
    images: ogImages("게코드 소개"),
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "게코드 소개", path: "/about" },
          ]),
          aboutPageJsonLd(),
        ]}
      />
      <AboutIntro />
      <AboutFeatures />
      <AboutFacility />
      <AboutLocation />
    </>
  );
}
