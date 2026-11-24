import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-140 w-full items-center justify-center overflow-hidden sm:min-h-170 lg:min-h-205">
      <Image
        src="/images/home/hero-main.png"
        alt="게코드의 사육 공간"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/25 mix-blend-darken" />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-360 px-5 text-center">
        <div className="mx-auto max-w-sm text-white sm:max-w-xl lg:max-w-3xl">
          <h1
            className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-[64px] lg:leading-[1.15]"
          >
            개체마다 지닌
            <br />
            고유한 아름다움이 있습니다.
          </h1>
          <p
            className="mt-4 text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-lg lg:text-xl"
          >
            체계적인 코드별 혈통 관리와 누대 브리딩을 통해
            <br className="hidden sm:block" />
            더욱 높은 가치를 만들어 나갑니다.
          </p>
        </div>
      </div>
    </section>
  );
}
