import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/common/icons";

// 실제 케어시트 6개 섹션 중 대표 3개입니다(/care-sheet 페이지에서 전체 구성을 확인할 수 있습니다).
const CARE_ITEMS = [
  {
    title: "사육장과 용품",
    note: "사육장부터 은신처, 바닥재까지 편안한 보금자리를 위한 준비물을 알아보세요.",
    image: "/images/home/care-storage.png",
  },
  {
    title: "기본 환경",
    note: "적정 온도와 습도, 환기와 분무 방법까지 건강한 생활을 위한 환경 관리법을 살펴보세요.",
    image: "/images/home/care-environment.png",
  },
  {
    title: "먹이와 급여",
    note: "주식 사료와 곤충의 종류부터 급여량과 횟수까지 올바른 먹이 관리 방법을 알아보세요.",
    image: "/images/home/care-feeding.png",
  },
] as const;

export default function CareSheetPreview() {
  return (
    <section className="w-full bg-[#f1f1f1] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto flex max-w-360 flex-col items-center gap-3 px-5 text-center">
        <p className="text-sm font-semibold text-black sm:text-base">
          CARE SHEET
        </p>
        <h2 className="text-2xl font-semibold sm:text-3xl lg:text-[40px]">
          건강한 일상을 위한 작은 가이드
        </h2>
        <p className="text-base sm:text-lg">
          새로운 환경에서도 편안하게 적응하고 건강하게 성장할 수 있도록 필요한
          케어 정보를 안내합니다.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-360 grid-cols-1 gap-6 px-5 sm:grid-cols-3 sm:gap-5 lg:mt-14 lg:gap-6">
        {CARE_ITEMS.map((item, index) => (
          <Link
            key={item.title}
            href="/care-sheet"
            data-aos="fade-up"
            data-aos-delay={index * 150}
            className="group block overflow-hidden bg-white"
          >
            <div className="relative aspect-517/413 w-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-lg font-semibold sm:text-xl lg:text-2xl">
                {item.title}
              </p>
              <p className="mt-2 pb-4 text-sm text-black sm:text-base">
                {item.note}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-360 justify-center px-5 lg:mt-14">
        <Link
          href="/care-sheet"
          className="inline-flex items-center gap-1.5 text-base font-medium text-black transition-colors hover:text-black/70"
        >
          케어시트 자세히보기
          <ChevronRightIcon className="h-2 w-3.5 -rotate-90" />
        </Link>
      </div>
    </section>
  );
}
