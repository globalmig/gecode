"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { BreederOption } from "@/lib/breeders/types";

type Props = {
  name: string;
  label: string;
  options: BreederOption[];
  initial: BreederOption | null;
  error?: string;
};

export function ParentPicker({ name, label, options, initial, error }: Props) {
  const [selected, setSelected] = useState<BreederOption | null>(initial);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return options;
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(keyword) ||
        (option.english_name ?? "").toLowerCase().includes(keyword),
    );
  }, [options, query]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input type="hidden" name={name} value={selected?.id ?? ""} />

      <div className="flex items-center gap-3 rounded border border-foreground/15 p-2.5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-foreground/5">
          {selected?.image_url && (
            <Image src={selected.image_url} alt={selected.name} fill className="object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          {selected ? (
            <>
              <p className="truncate font-medium">{selected.name}</p>
              {selected.english_name && (
                <p className="truncate text-foreground/50">{selected.english_name}</p>
              )}
            </>
          ) : (
            <p className="text-foreground/40">미등록</p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="shrink-0 rounded px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/10"
        >
          {selected ? "변경" : "개체 선택"}
        </button>
        {selected && (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setOpen(false);
            }}
            className="shrink-0 rounded px-2 py-1.5 text-sm text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
          >
            선택 해제
          </button>
        )}
      </div>

      {open && (
        <div className="flex flex-col gap-3 rounded border border-foreground/15 p-3">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="이름으로 검색"
            className="input"
          />

          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-foreground/40">
              선택할 수 있는 개체가 없습니다.
            </p>
          ) : (
            <div className="grid max-h-64 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
              {filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelected(option);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex flex-col gap-1.5 rounded border p-2 text-left transition-colors ${
                    selected?.id === option.id
                      ? "border-accent bg-accent/5"
                      : "border-foreground/10 hover:border-accent/50"
                  }`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded bg-foreground/5">
                    {option.image_url && (
                      <Image src={option.image_url} alt={option.name} fill className="object-cover" />
                    )}
                  </div>
                  <p className="truncate text-xs font-medium">{option.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
