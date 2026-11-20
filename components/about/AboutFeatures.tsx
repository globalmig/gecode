import Image from "next/image";

const FEATURES = [
  {
    title: "아름다움에 기준을 더하다",
    image: "/images/about/feature-1.png",
    alt: "나무 위에 올라선 크레스티드 게코",
    lines: [
      "개체마다 지닌 본연의 고유한 매력을 발견하고,",
      "외형적 완성도와 건강, 브리딩의 가치를 함께 고민합니다.",
      "세심한 관찰과 엄격한 기준을 바탕으로 시간이 흐를수록",
      "더욱 빛나는 개체만을 신중하게 선별합니다.",
    ],
  },
  {
    title: "분명한 기준으로 이어가는 브리딩",
    image: "/images/about/feature-2.png",
    alt: "손 위에 올라온 크레스티드 게코",
    lines: [
      "단순한 외형의 기준을 넘어, 개체마다 지닌",
      "고유한 특징과 나아갈 브리딩의 방향을 함께 고려합니다.",
      "타협 없는 선별 과정과 체계적인 관리 기준을 바탕으로 지향하는",
      "가치에 부합하는 개체만을 이어갑니다.",
    ],
  },
  {
    title: "건강한 성장을 위한 세심한 관리",
    image: "/images/about/feature-3.png",
    alt: "사육 용기 안에서 관리받는 어린 크레스티드 게코",
    lines: [
      "어린 개체부터 성장 과정에서 나타나는 변화와",
      "개체 고유의 매력을 세심하게 살펴봅니다.",
      "적절한 사육 환경과 꾸준한 관찰을 바탕으로",
      "개체의 건강 상태와 성장 과정을 관리합니다.",
    ],
  },
] as const;

export default function AboutFeatures() {
  return (
    <section className="relative w-full overflow-hidden bg-[#222222] py-16 sm:py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/about/texture.png"
          alt=""
          fill
          className="object-cover object-bottom"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(157deg, rgba(0,0,0,0.65) 56%, rgba(34,34,34,0.2) 94%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-360 flex-col gap-12 px-5 sm:gap-16 lg:gap-20">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-16"
          >
            <div className="relative aspect-700/475 w-full overflow-hidden">
              <Image
                src={feature.image}
                alt={feature.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="flex flex-col gap-3 pt-4 text-white sm:gap-4">
              <h3 className="text-xl font-semibold sm:text-2xl lg:text-4xl">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-white/90 sm:text-lg">
                {feature.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
