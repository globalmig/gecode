import type { Metadata } from "next";
import { JsonLd } from "@/components/common/JsonLd";
import { siteConfig } from "@/lib/seo/config";
import { breadcrumbJsonLd, careSheetArticleJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "케어시트",
  description:
    "기본 환경부터 먹이, 위생, 번식, 핸들링까지 크레스티드 게코 사육에 필요한 모든 정보를 확인하세요.",
  alternates: { canonical: "/care-sheet" },
  openGraph: {
    title: `케어시트 | ${siteConfig.name}`,
    description:
      "기본 환경부터 먹이, 위생, 번식, 핸들링까지 크레스티드 게코 사육에 필요한 모든 정보를 확인하세요.",
    url: "/care-sheet",
  },
};

const SECTIONS = [
  { id: "environment", title: "기본 환경" },
  { id: "enclosure", title: "사육장과 용품" },
  { id: "feeding", title: "먹이와 급여" },
  { id: "hygiene", title: "위생과 건강" },
  { id: "breeding", title: "성별과 번식" },
  { id: "handling", title: "핸들링과 입양팁" },
] as const;

export default function CareSheetPage() {
  return (
    <div className="mx-auto flex max-w-360 flex-col gap-10 px-5 py-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "홈", path: "/" },
            { name: "케어시트", path: "/care-sheet" },
          ]),
          careSheetArticleJsonLd(),
        ]}
      />
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">케어시트</h1>
        <p className="text-base text-foreground/70">
          처음 준비할 것부터 매일 살펴볼 것까지, 크레스티드 게코 사육 정보를
          한 번에 확인하세요.
        </p>
      </div>

      {/* speakable 대상: AEO 대응을 위해 요약 카드가 채워지면 id는 유지한다. */}
      <div id="care-summary" className="rounded-lg border border-black/10 p-6">
        {/* TODO: 적정 온도/습도/급여 주기 등 요약 수치는 content-plan.md
          "한눈에 보는 기본 관리 요약" 섹션 확정 후 채웁니다. */}
        <p className="text-sm text-foreground/60">
          한눈에 보는 기본 관리 요약 (준비 중)
        </p>
      </div>

      <nav aria-label="케어시트 목차" className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border border-black/10 px-4 py-1.5 text-sm"
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="flex flex-col gap-16">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            {/* TODO: 섹션 원고는 content-plan.md 케어시트 6섹션 검토 요청 항목 확정 후 채웁니다. */}
            <p className="text-sm text-foreground/60">준비 중입니다.</p>
          </section>
        ))}
      </div>
    </div>
  );
}
