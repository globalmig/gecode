/**
 * TODO(고객사 확정 필요): 아래 값 중 일부는 실제 도메인이 정해지면 교체해야 합니다.
 * - url: 실제 배포 도메인 (Vercel/구매 도메인 확정 전 임시값)
 * - business.legalName/registrationNumber/address: Footer.tsx 표기 기준으로 선반영함
 */
export const siteConfig = {
  name: "게코드",
  shortName: "게코드",
  url: "https://gecode.kr",
  description:
    "게코드는 크레스티드 게코 등 반려 파충류 브리더(개체) 정보와 사육 케어시트를 제공합니다.",
  // 공유 링크(OG/트위터 카드)에 쓰이는 대표 이미지 - public 기준 경로, 1200x630
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
  ],
  contact: {
    phone: "010-3824-1006",
    kakaoUrl: "http://pf.kakao.com/_xexgJvX",
    instagramUrl: "https://www.instagram.com/gecode.official?cnvx=M2txMnk2aGF4d3Bp",
  },
  business: {
    legalName: "게코드",
    representative: "김민수",
    registrationNumber: "528-75-00641",
    address: "경남 김해시 가야로 157번길 22-8 1층",
  },
} as const;

// 페이지별 openGraph.images에 공통으로 쓰는 대표 이미지 메타 - Next는 openGraph 필드를
// 페이지 metadata가 자체 정의하면 통째로 덮어쓰므로(sub-field 단위 병합 아님), 각 페이지에서
// 명시적으로 넣어줘야 한다.
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
