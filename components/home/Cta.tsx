import Image from "next/image";
import { siteConfig } from "@/lib/seo/config";
import { KakaoIcon, InstagramIcon } from "@/components/common/icons";
import Link from "next/link";

export default function Cta() {
  const kakaoHref = siteConfig.contact.kakaoUrl || "#";
  const instagramHref = siteConfig.contact.instagramUrl || "#";

  return (
    <section className="relative flex min-h-90 w-full items-center justify-center overflow-hidden bg-black py-16 text-center sm:min-h-105 sm:py-20 lg:min-h-120">
      <Image
        src="/images/home/cta-leaves-left.png"
        alt=""
        fill
        className="object-cover object-left opacity-70"
        sizes="100vw"
      />
      <Image
        src="/images/home/cta-leaves-right.png"
        alt=""
        fill
        className="object-cover object-right opacity-70"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex flex-col items-center gap-4 px-5 text-white sm:gap-5">
        <p className="text-sm font-semibold sm:text-base">CONTACT</p>
        <h2 className="text-2xl font-semibold leading-snug sm:text-3xl lg:text-[40px]">
          작은 궁금증도 함께 나눠요.
        </h2>
        <p className="text-sm leading-relaxed sm:text-base lg:text-lg">
          어떤 내용이든 편하게 문의해 주세요.
          <br className="hidden sm:block" />
          개체에 대한 이야기부터 사육과 케어에 관한 궁금증까지 친절하게 안내해 드립니다.
        </p>
        <div className="mt-2 flex flex-col items-center gap-3 lg:flex-row">
          <Link
            href={kakaoHref}
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-medium text-black transition-opacity hover:opacity-90 sm:px-8"
          >
            카카오톡으로 문의하기
            <KakaoIcon className="h-4 w-4 text-black" />
          </Link>
          <Link
            href={instagramHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-3 text-base font-medium text-white transition-opacity hover:opacity-90 sm:px-8"
          >
            인스타그램 이동하기
            <InstagramIcon className="h-4 w-4 text-white" />
          </Link>
        </div>
      </div>
    </section>
  );
}
