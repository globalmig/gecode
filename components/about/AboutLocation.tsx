import { KAKAO_HREF, PHONE_NUMBER } from "@/lib/contact";
import { siteConfig } from "@/lib/seo/config";
import { KakaoIcon, InstagramIcon } from "@/components/common/icons";

const MAP_QUERY = encodeURIComponent(`${siteConfig.name} ${siteConfig.business.address}`);
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;

const INFO_ROWS = [
  {
    label: "주소",
    value: (
      <>
        {siteConfig.business.address}
        <br />
        장신연대역 2번 출구에서 976m
      </>
    ),
  },
  { label: "영업시간", value: "평일·주말 14:00 ~ 20:00 운영" },
  { label: "연락처", value: PHONE_NUMBER },
] as const;

export default function AboutLocation() {
  const instagramHref = siteConfig.contact.instagramUrl || "#";

  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-360 px-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-black sm:text-base">ADDRESS</p>
          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[50px]">
            오시는 길
          </h2>
          <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
            건강한 개체 분양부터 세심한 사육 상담을
            <br />
            진행해드리고 있습니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:mt-14 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <div className="aspect-4/3 w-full overflow-hidden bg-[#d2d2d2] lg:aspect-auto lg:min-h-100">
            <iframe
              src={MAP_EMBED_SRC}
              title="게코드 매장 위치 지도"
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <dl className="flex flex-col divide-y divide-black/10 border-y border-black/10">
            {INFO_ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[6rem_1fr] gap-4 py-5 sm:grid-cols-[7rem_1fr] sm:py-6"
              >
                <dt className="font-semibold sm:text-lg">{row.label}</dt>
                <dd className="text-black sm:text-lg">{row.value}</dd>
              </div>
            ))}

            <div className="grid grid-cols-[6rem_1fr] items-center gap-4 py-5 sm:grid-cols-[7rem_1fr] sm:py-6">
              <dt className="font-semibold sm:text-lg">SNS 채널</dt>
              <dd className="flex items-center gap-3">
                <a
                  href={KAKAO_HREF}
                  aria-label="카카오 상담하기"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-ink transition-opacity hover:opacity-90"
                >
                  <KakaoIcon className="h-4.5 w-4.5" />
                </a>
                <a
                  href={instagramHref}
                  aria-label="인스타그램으로 보기"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
                >
                  <InstagramIcon className="h-4.5 w-4.5" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
