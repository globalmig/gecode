import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/common/icons";

// TODO(고객사 확정 필요): 실제 개체 코드명·사진·성별 데이터로 교체 필요.
// 현재는 실제 매장 사인에 표기된 모프 라인명(AXANTHIC / SUPER STRIPE / MT BACK)과
// 업계에서 통용되는 모프 명칭(PINSTRIPE)을 임시로 사용합니다.
const BREEDER_PREVIEWS = [
  { code: "AXANTHIC", englishName: "Axanthic", image: "/images/home/breeder-1.png" },
  { code: "SUPER STRIPE", englishName: "Super Stripe", image: "/images/home/breeder-2.png" },
  { code: "MT BACK", englishName: "Mt. Back", image: "/images/home/breeder-3.png" },
  { code: "PINSTRIPE", englishName: "Pinstripe", image: "/images/home/breeder-4.png" },
];

export default function BreederPreview() {
  return (
    <section className="relative w-full overflow-hidden bg-[#222222] py-16 sm:py-20 lg:py-28">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(117deg, #222222 20%, #777777 98%)",
        }}
      />
      <Image
        src="/images/home/breeder-texture.png"
        alt=""
        fill
        className="absolute inset-0 object-cover opacity-20"
        sizes="100vw"
      />

      <div className="relative mx-auto max-w-300 px-5 lg:px-0">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-[0.2em] text-white">
            ABOUT
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-[40px]">
            브리더 소개
          </h2>
          <p className="text-base text-white/70 sm:text-lg">
            세대를 이어가는 GECODE의 개체들을 소개합니다.
          </p>
        </div>

        <div className="mt-6 flex justify-end lg:mt-8">
          <Link
            href="/breeder"
            className="inline-flex items-center gap-1.5 text-base font-medium text-white transition-colors hover:text-white/70"
          >
            브리더 소개 전체 보기
            <ChevronRightIcon className="h-2 w-3.5 -rotate-90" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-8 lg:grid-cols-4 lg:gap-6">
          {BREEDER_PREVIEWS.map((breeder) => (
            <Link
              key={breeder.code}
              href="/breeder"
              className="group relative block aspect-[380/525] overflow-hidden border border-white/60"
            >
              <Image
                src={breeder.image}
                alt={`${breeder.code} 개체`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3 text-white sm:px-5 sm:py-4">
                <p className="text-lg font-semibold leading-tight sm:text-xl lg:text-2xl">
                  {breeder.code}
                </p>
                <p className="mt-0.5 text-xs text-white/70 sm:text-sm lg:text-base">
                  {breeder.englishName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
