"use client";

import { useId, useState } from "react";
import type { FaqCategory } from "@/app/faq/content";
import { ChevronRightIcon } from "@/components/common/icons";

export default function FaqAccordion({ categories }: { categories: FaqCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0].id);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const active = categories.find((category) => category.id === activeId) ?? categories[0];
  const tabsId = useId();

  function handleTabChange(id: string) {
    setActiveId(id);
    setOpenQuestion(null);
  }

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div role="tablist" aria-label="FAQ 카테고리" className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const selected = category.id === activeId;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`${tabsId}-tab-${category.id}`}
              aria-selected={selected}
              aria-controls={`${tabsId}-panel-${category.id}`}
              onClick={() => handleTabChange(category.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors sm:text-base ${
                selected ? "bg-black text-white" : "bg-black/5 text-black/60 hover:bg-black/10"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-panel-${active.id}`}
        aria-labelledby={`${tabsId}-tab-${active.id}`}
        className="flex flex-col divide-y divide-black/10 border-t border-b border-black/10"
      >
        {active.items.map((item) => {
          const isOpen = openQuestion === item.question;
          return (
            <div key={item.question}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenQuestion(isOpen ? null : item.question)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left sm:py-6"
                >
                  <span className="text-base font-semibold text-black sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronRightIcon
                    className={`h-2.5 w-4 shrink-0 text-black/50 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>
              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="whitespace-pre-line pb-6 text-base text-black sm:text-lg">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
