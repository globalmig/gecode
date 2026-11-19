/**
 * TODO(고객사 확정 필요): 아래 값 중 일부는 실제 도메인이 정해지면 교체해야 합니다.
 * - url: 실제 배포 도메인 (Vercel/구매 도메인 확정 전 임시값)
 * - contact.kakaoUrl/instagramUrl: Header.tsx에도 동일하게 placeholder로 표시됨
 * - business.legalName/registrationNumber/address: Footer.tsx 표기 기준으로 선반영함
 */
export const siteConfig = {
  name: "게코드",
  shortName: "게코드",
  url: "https://gecode.kr",
  description:
    "게코드는 크레스티드 게코 등 반려 파충류 브리더(개체) 정보와 사육 케어시트를 제공합니다.",
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
    kakaoUrl: "",
    instagramUrl: "",
  },
  business: {
    legalName: "게코드",
    representative: "김민수",
    registrationNumber: "528-75-00641",
    address: "경남 김해시 가야로 157번길 22-8 1층",
  },
} as const;

export const siteNav = [
  { title: "홈", path: "/" },
  { title: "브리더 소개", path: "/breeder" },
  { title: "게코드 소개", path: "/about" },
  { title: "케어시트", path: "/care-sheet" },
  { title: "FAQ", path: "/faq" },
] as const;
