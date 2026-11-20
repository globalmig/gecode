import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/common/icons";

export default function BrandIntro() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-20 sm:py-24 lg:py-32">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/home/brand-gecko-mo.png"
          alt=""
          fill
          className="object-cover object-right sm:hidden"
          sizes="100vw"
        />
        <Image
          src="/images/home/brand-gecko.png"
          alt=""
          fill
          className="hidden object-cover object-right sm:block"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) 42%, rgba(255,255,255,0) 68%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-360 px-5">
        <div className="max-w-md">
          <p className="text-sm font-semibold text-black sm:text-base">
            ABOUT GECODE
          </p>
          <h2 className="mt-3 text-2xl font-semibold leading-snug sm:text-3xl lg:text-[40px]">
            개체를 대하는 마음이
            <br />
            브리딩을 만듭니다.
          </h2>
          <p className="mt-5 leading-relaxed sm:text-lg">
            GECODE는 단순한 애완동물이 아닌,
            <br />
            하나의 생명으로서 존중하며
            <br />
            건강하고 가치있는 개체를 브리딩합니다.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-1.5 text-base font-medium text-black transition-colors hover:text-black/70"
          >
            GECODE 자세히 보기
            <ChevronRightIcon className="h-2 w-3.5 -rotate-90" />
          </Link>
        </div>
      </div>
    </section>
  );
}
