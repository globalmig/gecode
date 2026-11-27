export const siteConfig = {
  name: "게코드",
  shortName: "게코드",
  url: "https://gecode.kr",
  description:
    "게코드는 크레스티드 게코 등 반려 파충류 브리더(개체) 정보와 사육 케어시트를 제공합니다.",
  ogImage: "/images/og_image.png",
  locale: "ko_KR",
  language: "ko",
  keywords: [
    "게코드",
    "크레스티드 게코",
    "크레스티드게코 분양",
    "파충류 브리더",
    "크레스티드 게코 케어시트",
    "크레스티드 게코 사육",
    "반려 파충류",
    "게코 분양",
    "게코 입양"
  ],
  contact: {
    phone: "010-3824-1006",
    kakaoUrl: "https://pf.kakao.com/_xexgJvX",
    instagramUrl: "https://www.instagram.com/gecode.official?cnvx=M2txMnk2aGF4d3Bp",
  },
  business: {
    legalName: "게코드",
    representative: "김민수",
    registrationNumber: "528-75-00641",
    address: "경남 김해시 가야로 157번길 22-8 1층",
  },
} as const;

export function ogImages(alt: string = siteConfig.name) {
  return [{ url: siteConfig.ogImage, width: 1200, height: 630, alt }];
}

export const siteNav = [
  { title: "홈", path: "/" },
  { title: "브리더 소개", path: "/breeder" },
  { title: "게코드 소개", path: "/about" },
  { title: "케어시트", path: "/care-sheet" },
  { title: "FAQ", path: "/faq" },
] as const;
