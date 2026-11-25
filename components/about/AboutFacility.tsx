import Image from "next/image";

const FACILITY_IMAGES = [
  {
    src: "/images/about/facility-1.jpg",
    alt: "GECODE 로고와 전시 진열장이 있는 매장 입구 전경",
  },
  {
    src: "/images/about/facility-2.jpg",
    alt: "크레스티드 게코 액자와 소파가 놓인 상담 공간",
  },
  {
    src: "/images/about/facility-3.jpg",
    alt: "공기청정기와 정리된 사육 선반이 있는 내부 사육 공간",
  },
] as const;

export default function AboutFacility() {
  return (
    <section className="w-full bg-[#f1f1f1] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-360 px-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-black sm:text-base">FACILITY</p>
          <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[50px]">
            청결하고 쾌적한 사육환경
          </h2>
          <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
            개체 하나하나가 편안하게 지낼 수 있도록,
            <br />
            위생과 온습도까지 세심하게 관리되는 공간을 직접 보여드립니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-14 lg:gap-8">
          {FACILITY_IMAGES.map((image, index) => (
            <div
              key={image.src}
              data-aos="fade-right"
              data-aos-delay={index * 150}
              className="relative aspect-3/4 w-full overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
