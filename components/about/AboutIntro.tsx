import Image from "next/image";

export default function AboutIntro() {
  return (
    <section className="w-full bg-[#f1f1f1] py-16 sm:py-20 lg:py-28">
      <div className="mx-auto grid max-w-360 grid-cols-1 gap-10 px-5 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
        <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
          <p className="text-sm font-semibold text-black">ABOUT GECODE</p>
          <h1 className="text-3xl font-semibold leading-snug sm:text-4xl lg:text-[50px]">
            첫 눈맞춤의 설렘부터,
            <br />
            건강한 성장의 여정까지
          </h1>
          <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
            생명에 대한 진심 어린 태도가 만들어내는
            <br />
            건강하고 아름다운 변화를 만나보세요.
          </p>
        </div>

        <div className="relative aspect-476/591 w-full max-w-sm overflow-hidden lg:col-start-2 lg:row-start-1 lg:ml-auto lg:max-w-none">
          <Image
            src="/images/about/sign.png"
            alt="매장 입구에 설치된 GECODE 사인과 조명"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 38vw, 90vw"
          />
        </div>

        <div className="relative aspect-738/982 w-full overflow-hidden lg:col-start-1 lg:row-start-2">
          <Image
            src="/images/about/interior.png"
            alt="식물과 조명으로 쾌적하게 꾸며진 게코드 사육 공간 내부"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col justify-center gap-8 lg:col-start-2 lg:row-start-2">
          <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
            작은 숨결 하나까지 배려한 쾌적한 공간에서,
            <br />
            설렘이 안심으로 바뀝니다.
          </p>
          <p className="text-base leading-relaxed sm:text-lg lg:text-xl">
            철저한 위생 관리와 세심하게 설계된 환경 속에서
            <br />
            가장 이상적인 케어가 시작됩니다.
          </p>
        </div>
      </div>
    </section>
  );
}
