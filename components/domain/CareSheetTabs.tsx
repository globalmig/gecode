"use client";

import { useId, useState } from "react";
import Image from "next/image";
import {
  CARE_SHEET_PLACEHOLDER_IMAGE,
  type CareSheetSection,
} from "@/app/care-sheet/content";

export default function CareSheetTabs({
  sections,
}: {
  sections: CareSheetSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0].id);
  const active = sections.find((section) => section.id === activeId) ?? sections[0];
  const tabsId = useId();

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div
        role="tablist"
        aria-label="케어시트 카테고리"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
            className={`flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-16 ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="relative aspect-3/2 w-full overflow-hidden lg:w-1/2">
              <Image
                src={CARE_SHEET_PLACEHOLDER_IMAGE}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-col gap-3 lg:w-1/2">
              <h3 className="text-xl font-bold sm:text-2xl lg:text-[28px]">
                {item.title}
              </h3>
              <p className="text-base text-black/70 sm:text-lg">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
