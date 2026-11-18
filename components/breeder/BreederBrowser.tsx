"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { genderLabel, type Breeder, type BreederGender } from "@/lib/breeders/types";
import { ChevronRightIcon, CloseIcon, RefreshIcon, SearchIcon } from "@/components/common/icons";

type GenderOption = "all" | BreederGender;
type ParentOption = "all" | "father" | "mother";

const GENDER_OPTIONS: { value: GenderOption; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "male", label: genderLabel.male },
  { value: "female", label: genderLabel.female },
];

const PARENT_OPTIONS: { value: ParentOption; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "father", label: "부 개체" },
  { value: "mother", label: "모 개체" },
];

function useParentRoles(entries: Breeder[]) {
  return useMemo(() => {
    const fathers = new Set(entries.map((entry) => entry.father_name).filter((name): name is string => !!name));
    const mothers = new Set(entries.map((entry) => entry.mother_name).filter((name): name is string => !!name));
    return { fathers, mothers };
  }, [entries]);
}

export default function BreederBrowser({ entries }: { entries: Breeder[] }) {
  const [gender, setGender] = useState<GenderOption>("all");
  const [parentRole, setParentRole] = useState<ParentOption>("all");
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<"gender" | "parent" | null>(null);

  const { fathers, mothers } = useParentRoles(entries);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (gender !== "all" && entry.gender !== gender) return false;
      if (parentRole === "father" && !fathers.has(entry.name)) return false;
      if (parentRole === "mother" && !mothers.has(entry.name)) return false;
      if (
        keyword &&
        !entry.name.toLowerCase().includes(keyword) &&
        !(entry.english_name ?? "").toLowerCase().includes(keyword)
      ) {
        return false;
      }
      return true;
    });
  }, [entries, gender, parentRole, query, fathers, mothers]);

  const hasActiveFilter = gender !== "all" || parentRole !== "all" || query.trim().length > 0;

  function resetFilters() {
    setGender("all");
    setParentRole("all");
    setQuery("");
    setOpenMenu(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={resetFilters}
            aria-pressed={!hasActiveFilter}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              !hasActiveFilter
                ? "bg-black text-white"
                : "border border-black/10 bg-white text-black hover:border-black/30"
            }`}
          >
            전체
          </button>

          <FilterDropdown
            label="성별"
            value={gender}
            options={GENDER_OPTIONS}
            isOpen={openMenu === "gender"}
            onToggle={() => setOpenMenu((prev) => (prev === "gender" ? null : "gender"))}
            onClose={() => setOpenMenu(null)}
            onSelect={(value) => {
              setGender(value);
              setOpenMenu(null);
            }}
          />

          <FilterDropdown
            label="부/모"
            value={parentRole}
            options={PARENT_OPTIONS}
            isOpen={openMenu === "parent"}
            onToggle={() => setOpenMenu((prev) => (prev === "parent" ? null : "parent"))}
            onClose={() => setOpenMenu(null)}
            onSelect={(value) => {
              setParentRole(value);
              setOpenMenu(null);
            }}
          />

          <div className="relative min-w-50 flex-1">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="한글 또는 영문 이름"
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pr-11 pl-5 text-sm text-black placeholder:text-black/40 focus:border-black/30 focus:outline-none"
            />
            <SearchIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-black/50" />
          </div>
        </div>

        {hasActiveFilter && (
          <div className="flex flex-wrap items-center gap-2.5">
            {gender !== "all" && (
              <FilterChip label={genderLabel[gender]} onRemove={() => setGender("all")} />
            )}
            {parentRole !== "all" && (
              <FilterChip
                label={PARENT_OPTIONS.find((option) => option.value === parentRole)!.label}
                onRemove={() => setParentRole("all")}
              />
            )}
            {query.trim() && (
              <FilterChip label={`"${query.trim()}"`} onRemove={() => setQuery("")} />
            )}
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-sm text-black/50 transition-colors hover:text-black"
            >
              <RefreshIcon className="h-3.5 w-3.5" />
              설정 초기화
            </button>
          </div>
        )}
      </div>

      <p className="text-sm text-black/50">개체 {filtered.length}마리</p>

      {entries.length === 0 ? (
        <p className="rounded-lg border border-black/10 px-6 py-16 text-center text-sm text-black/50">
          등록된 개체가 없습니다.
        </p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6">
          {filtered.map((entry) => (
            <Link key={entry.id} href={`/breeder/${entry.id}`} className="group flex flex-col gap-3">
              <div className="relative aspect-6/5 overflow-hidden bg-black/5">
                {entry.image_url ? (
                  <Image
                    src={entry.image_url}
                    alt={`${entry.name} 개체 사진`}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-black/30">
                    사진 준비중
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-bold sm:text-xl">{entry.name}</p>
                {entry.english_name && (
                  <p className="text-sm text-black/50 sm:text-base">{entry.english_name}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-black/10 px-6 py-16 text-center text-sm text-black/50">
          조건에 맞는 개체가 없습니다.
        </p>
      )}
    </div>
  );
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onClose,
  onSelect,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (value: T) => void;
}) {
  const selected = options.find((option) => option.value === value && option.value !== "all");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${
          selected ? "border-black bg-white text-black" : "border-black/10 bg-white text-black/70 hover:border-black/30"
        }`}
      >
        {selected ? selected.label : label}
        <ChevronRightIcon className={`h-1.5 w-2.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={onClose}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute top-full left-0 z-20 mt-2 min-w-32 overflow-hidden rounded-xl border border-black/10 bg-white py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-black/5 ${
                  option.value === value ? "font-semibold text-black" : "text-black/70"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white py-1.5 pr-2.5 pl-4 text-sm text-black">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`${label} 필터 제거`}
        className="flex h-4 w-4 items-center justify-center rounded-full text-black/40 transition-colors hover:bg-black/5 hover:text-black"
      >
        <CloseIcon className="h-2 w-2" />
      </button>
    </span>
  );
}
