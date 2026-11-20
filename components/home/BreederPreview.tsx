import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/common/icons";
import { listBreederPreviews } from "@/lib/breeders/queries";
import type { Breeder } from "@/lib/breeders/types";

const PREVIEW_COUNT = 4;

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

      <div className="relative mx-auto max-w-360 px-5">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-white sm:text-base">
            ABOUT
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-[40px]">
            브리더 소개
          </h2>
          <p className="text-base text-white sm:text-lg">
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

        <Suspense fallback={<BreederPreviewSkeleton />}>
          <BreederPreviewGrid />
        </Suspense>
      </div>
    </section>
  );
}

async function BreederPreviewGrid() {
  let breeders: Breeder[] = [];
  try {
    breeders = await listBreederPreviews(PREVIEW_COUNT);
  } catch {
    breeders = [];
  }

  if (breeders.length === 0) {
    return <p className="mt-6 text-sm text-white/50 lg:mt-8">등록된 개체가 없습니다.</p>;
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-8 lg:grid-cols-4 lg:gap-6">
      {breeders.map((breeder) => (
        <Link
          key={breeder.id}
          href={`/breeder/${breeder.id}`}
          className="group relative block aspect-380/525 overflow-hidden border border-white/60 bg-white/5"
        >
          {breeder.image_url ? (
            <Image
              src={breeder.image_url}
              alt={`${breeder.name} 개체 사진`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 25vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/30">
              사진 준비중
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-black/50 px-4 py-3 text-white sm:px-5 sm:py-4">
            <p className="text-lg font-semibold leading-tight sm:text-xl lg:text-2xl">
              {breeder.name}
            </p>
            {breeder.english_name && (
              <p className="mt-0.5 text-sm text-white/70 sm:text-base">
                {breeder.english_name}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function BreederPreviewSkeleton() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:mt-8 lg:grid-cols-4 lg:gap-6">
      {Array.from({ length: PREVIEW_COUNT }).map((_, index) => (
        <div
          key={index}
          aria-hidden
          className="aspect-380/525 animate-pulse border border-white/10 bg-white/5"
        />
      ))}
    </div>
  );
}
