"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { KAKAO_HREF, PHONE_HREF } from "@/lib/contact";
import { siteConfig } from "@/lib/seo/config";
import { KakaoIcon, PhoneIcon, InstagramIcon } from "@/components/common/icons";

const NAV_ITEMS = [
  { label: "게코드 소개", href: "/about" },
  { label: "브리더 소개", href: "/breeder" },
  { label: "케어시트", href: "/care-sheet" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const instagramHref = siteConfig.contact.instagramUrl || "#";

  return (
    <header
      className={`w-full px-5 pt-3 sm:pt-4 lg:px-5 lg:pt-6 ${isHome ? "fixed inset-x-0 top-0 z-50" : "sticky top-0 z-50"}`}
    >
      <div
        className={`mx-auto flex h-16 max-w-300 items-center justify-between sm:h-20 lg:h-24.25 ${
          isHome
            ? "px-0"
            : "rounded-full bg-white/30 px-5 backdrop-blur-md backdrop-saturate-150 sm:px-6 lg:px-8"
        }`}
      >
        <Link href="/" className="relative h-6 w-27.5 shrink-0 sm:h-7 sm:w-35 lg:h-7.25 lg:w-45.5">
          <Image
            src={isHome ? "/images/header-logo-white.png" : "/images/header-logo.png"}
            alt="GECODE"
            fill
            priority
            className="object-contain object-left"
            sizes="182px"
          />
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-nav font-medium transition-colors focus-visible:outline-none ${
                isHome
                  ? "text-white hover:text-white/70 focus-visible:text-white/70"
                  : "text-black hover:text-accent focus-visible:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isHome ? (
            <>
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
              <a
                href={PHONE_HREF}
                aria-label="전화 상담하기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90"
              >
                <PhoneIcon className="h-4 w-4" />
              </a>
            </>
          ) : (
            <>
              <a
                href={KAKAO_HREF}
                aria-label="카카오 상담하기"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-brand-ink transition-opacity hover:opacity-90"
              >
                <KakaoIcon className="h-5 w-5" />
                <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  카카오 상담하기
                </span>
              </a>
              <a
                href={PHONE_HREF}
                aria-label="전화 상담하기"
                className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-opacity hover:opacity-90"
              >
                <PhoneIcon className="h-4.5 w-4.5" />
                <span className="pointer-events-none absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  전화 상담하기
                </span>
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-label="메뉴 열기"
          className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-1.25 lg:hidden"
        >
          <span
            className={`h-0.5 w-6 transition-transform ${isHome ? "bg-white" : "bg-black"} ${isMenuOpen ? "translate-y-1.75 rotate-45" : ""}`}
          />
          <span className={`h-0.5 w-6 transition-opacity ${isHome ? "bg-white" : "bg-black"} ${isMenuOpen ? "opacity-0" : ""}`} />
          <span
            className={`h-0.5 w-6 transition-transform ${isHome ? "bg-white" : "bg-black"} ${isMenuOpen ? "-translate-y-1.75 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <div className="mx-auto mt-3 max-w-300 rounded-[28px] border border-black/5 bg-white px-5 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.08)] lg:hidden">
          <nav className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-nav font-medium text-black transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={KAKAO_HREF}
              className="flex-1 rounded-full bg-brand-yellow px-5 py-2 text-center text-nav text-brand-ink"
            >
              카카오 상담
            </a>
            <a href={PHONE_HREF} className="flex-1 rounded-full bg-black px-5 py-2 text-center text-nav text-white">
              전화 상담
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
