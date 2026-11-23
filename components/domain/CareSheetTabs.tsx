"use client";

import { useId, useState } from "react";
import Image from "next/image";
import {
  CARE_SHEET_PLACEHOLDER_IMAGE,
  type CareSheetSection,
} from "@/app/care-sheet/content";

export type AdoptionChecklistItem = {
  title: string;
  description: string;
  image: string;
};

const ADOPTION_CHECKLIST_SECTION_ID = "enclosure";

// 단락 구분(\n\n)은 모든 화면에서 유지하고, 단순 줄바꿈(\n)은 모바일에서는
// 무시한 채 이어 붙이고 sm 이상에서만 줄바꿈으로 보여준다.
function CareDescription({
  text,
  textClassName,
}: {
  text: string;
  textClassName: string;
}) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="flex flex-col gap-3">
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split("\n");
        return (
          <p key={pIndex} className={textClassName}>
            {lines.map((line, lIndex) => (
              <span key={lIndex}>
                {line}
                {lIndex < lines.length - 1 ? (
                  <>
                    {" "}
                    <br className="hidden sm:block" />
                  </>
                ) : null}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function CareSheetTabs({
  sections,
  adoptionChecklist,
}: {
  sections: CareSheetSection[];
  adoptionChecklist: readonly AdoptionChecklistItem[];
}) {
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((section) => section.id === activeId) ?? sections[0];
  const tabsId = useId();

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div
        role="tablist"
        aria-label="케어시트 카테고리"
        className="flex flex-wrap gap-2"
      >
        {sections.map((section) => {
          const selected = section.id === activeId;
          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${section.id}`}
              aria-selected={selected}
              aria-controls={`${tabsId}-panel-${section.id}`}
              onClick={() => setActiveId(section.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:text-base ${
                selected
                  ? "bg-black text-white"
                  : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-${active.id}`}
        aria-labelledby={`${tabsId}-tab-${active.id}`}
        className="flex flex-col gap-12 lg:gap-20"
      >
        {active.items.map((item, index) => (
          <article
            key={item.title}
            className={`flex flex-col gap-6 lg:flex-row lg:gap-16 ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="relative aspect-3/2 w-full overflow-hidden lg:w-1/2">
              <Image
                src={item.image ?? CARE_SHEET_PLACEHOLDER_IMAGE}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div
              data-aos="fade-up"
              className="flex flex-col gap-3 pt-4 lg:w-1/2"
            >
              <h3 className="text-xl font-bold text-black sm:text-2xl lg:text-[28px]">
                {item.title}
              </h3>
              <CareDescription
                text={item.description}
                textClassName="text-base text-black sm:text-lg"
              />
            </div>
          </article>
        ))}
      </div>

      {active.id === ADOPTION_CHECKLIST_SECTION_ID && (
        <section className="flex flex-col gap-8 pt-14 sm:gap-10 sm:pt-16">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold sm:text-3xl">
              입양 전 준비물
            </h2>
            <p className="text-base text-black sm:text-lg">
              새로운 가족을 맞이하기 전, 편안하게 지낼 수 있는 환경을
              준비해주세요.
            </p>
          </div>

          <div className="flex flex-wrap justify-between gap-x-6 gap-y-10">
            {adoptionChecklist.map((item) => (
              <div
                key={item.title}
                className="flex w-[calc(50%-12px)] flex-col gap-4 sm:w-[calc(33.333%-16px)] lg:w-58"
              >
                <div className="relative aspect-square w-20 sm:w-24 lg:w-58 lg:mx-auto">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 232px, 96px"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold sm:text-lg">
                    {item.title}
                  </p>
                  <CareDescription
                    text={item.description}
                    textClassName="text-sm text-black sm:text-base"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
