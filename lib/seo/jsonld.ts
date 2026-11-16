import { siteConfig } from "./config";

type BreadcrumbItem = {
  name: string;
  path: string;
};

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

/** 전 페이지 공통 Organization 구조화 데이터. 연락처가 확정되면 sameAs/telephone을 채운다. */
export function organizationJsonLd() {
  const sameAs = [siteConfig.contact.instagramUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.business.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.business.address,
      addressCountry: "KR",
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(siteConfig.contact.phone
      ? { contactPoint: { "@type": "ContactPoint", telephone: siteConfig.contact.phone, contactType: "customer service" } }
      : {}),
  };
}

/** 홈페이지 전용 WebSite 구조화 데이터. 브리더 이름 검색을 SearchAction으로 노출해 AEO 대응. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/breeder?name={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** 브리더 소개 페이지: 실제 개체 데이터가 연결되면 itemListElement를 Supabase 조회 결과로 채운다. */
export function breederCollectionJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "브리더 소개",
    url: absoluteUrl("/breeder"),
    description:
      "이름, 성별, 부모 개체로 게코드의 크레스티드 게코 브리더(개체)를 검색할 수 있는 페이지입니다.",
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
}

/** 게코드 소개(브랜드) 페이지 - proposal.md의 "크레요트" 카테고리에 대응. */
export function aboutPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "게코드 소개",
    url: absoluteUrl("/about"),
    description: "게코드의 브리딩 철학과 사육 시설을 소개하는 브랜드 소개 페이지입니다.",
    mainEntity: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };
}

/**
 * 케어시트 페이지: 6개 섹션을 articleSection으로 노출하고, speakable으로 요약 카드를
 * 음성/AI 답변 엔진이 우선 인용할 수 있도록 지정한다(AEO 대응).
 */
export function careSheetArticleJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "크레스티드 게코 케어시트",
    url: absoluteUrl("/care-sheet"),
    description:
      "기본 환경, 사육장과 용품, 먹이와 급여, 위생과 건강, 성별과 번식, 핸들링과 입양팁까지 크레스티드 게코 사육 정보를 정리한 가이드입니다.",
    inLanguage: siteConfig.language,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    articleSection: [
      "기본 환경",
      "사육장과 용품",
      "먹이와 급여",
      "위생과 건강",
      "성별과 번식",
      "핸들링과 입양팁",
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#care-summary"],
    },
  };
}
