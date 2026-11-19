import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { getBreeder } from "@/lib/breeders/queries";
import { genderLabel, stageLabel } from "@/lib/breeders/types";

type Props = {
  params: Promise<{ id: string }>;
};

// 로그인 세션 쿠키를 읽는 Supabase 클라이언트로 매 요청 조회하므로 정적 프리렌더 대상에서 제외한다.
export const instant = false;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return { title: "브리더 소개" };

  const entry = await getBreeder(id);
  if (!entry) return { title: "브리더 소개" };

  const description = `게코드 브리더 ${entry.name}${entry.english_name ? `(${entry.english_name})` : ""}의 성별, 모프, 부모 개체 정보를 확인하세요.`;

  return {
    title: entry.name,
    description,
    alternates: { canonical: `/breeder/${entry.id}` },
    openGraph: {
      title: `${entry.name} | ${siteConfig.name}`,
      description,
      url: `/breeder/${entry.id}`,
    },
  };
}

export default async function BreederDetailPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) notFound();

  const entry = await getBreeder(id);
  if (!entry) notFound();

  const infoRows = [
    { label: "브리더 구분", value: "GECODE" },
    { label: "성별", value: genderLabel[entry.gender] },
    { label: "성장 단계", value: stageLabel[entry.stage] },
    { label: "모프", value: entry.morph ?? "미등록" },
    { label: "부 개체", value: entry.father_name ?? "미등록" },
    { label: "모 개체", value: entry.mother_name ?? "미등록" },
  ];

  return (
    <div className="mx-auto flex max-w-360 flex-col gap-10 px-5 py-16 sm:py-20 lg:py-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "브리더 소개", path: "/breeder" },
            { name: entry.name, path: `/breeder/${entry.id}` },
          ]),
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{entry.name}</h1>
        {entry.english_name && (
          <p className="text-lg text-black sm:text-xl lg:text-2xl">{entry.english_name}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-4/3 overflow-hidden bg-black/5">
          {entry.image_url ? (
            <Image
              src={entry.image_url}
              alt={`${entry.name} 개체 사진`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-black/30 sm:text-base">
              사진 준비중
            </div>
          )}
        </div>

        <dl className="flex flex-col border-t-2 border-black">
          {infoRows.map((row) => (
            <div key={row.label} className="flex gap-10 border-b border-black/10 py-5">
              <dt className="w-32 shrink-0 text-base font-bold sm:w-40">{row.label}</dt>
              <dd className="text-base text-black">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
