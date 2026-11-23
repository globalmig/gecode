"use client";

import { KAKAO_HREF, PHONE_HREF } from "@/lib/contact";
import { siteConfig } from "@/lib/seo/config";
import { KakaoIcon, PhoneIcon, InstagramIcon } from "@/components/common/icons";
import Link from "next/link";

const BUTTON_BASE =
  "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none sm:h-13 sm:w-13 lg:h-14 lg:w-14";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function FloatingButtons() {
  const instagramHref = siteConfig.contact.instagramUrl || "#";

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2.5 sm:bottom-6 sm:right-6 sm:gap-3 lg:bottom-10 lg:right-10">
      <Link
        href={instagramHref}
        target="_blank"
        rel="noreferrer"
        aria-label="인스타그램으로 보기"
        className={`${BUTTON_BASE} bg-linear-to-tr from-[#F9CE34] via-[#d62976] to-[#6228D7] text-white`}
      >
        <InstagramIcon className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
      </Link>

      <Link
        href={KAKAO_HREF}
        aria-label="카카오 상담"
        className={`${BUTTON_BASE} bg-brand-yellow text-brand-ink`}
      >
        <KakaoIcon className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
      </Link>

      <Link
        href={PHONE_HREF}
        aria-label="전화 상담"
        className={`${BUTTON_BASE} bg-black text-white`}
      >
        <PhoneIcon className="h-8 w-8" />
      </Link>

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="맨 위로 이동"
        className={`${BUTTON_BASE} border border-black/10 bg-white text-black`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5 sm:h-5.5 sm:w-5.5"
          aria-hidden="true"
        >
          <path
            d="M12 19V6M6 11.5L12 5.5L18 11.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
