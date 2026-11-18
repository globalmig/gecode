"use client";

import { useState } from "react";
import Image from "next/image";
import { BreederForm } from "./BreederForm";
import { Modal } from "./Modal";
import { DeleteBreederButton } from "./DeleteBreederButton";
import { updateBreeder } from "@/app/api/admin/breeders/actions";
import { genderLabel, type Breeder } from "@/lib/breeders/types";

export function BreederListItem({ breeder }: { breeder: Breeder }) {
  const [open, setOpen] = useState(false);
  const action = updateBreeder.bind(null, breeder.id);

  return (
    <>
      <li
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="flex cursor-pointer items-center gap-4 p-4 hover:bg-foreground/5"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-foreground/5">
          {breeder.image_url && (
            <Image src={breeder.image_url} alt={breeder.name} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">{breeder.name}</p>
            {!breeder.is_published && (
              <span className="rounded bg-foreground/10 px-1.5 py-0.5 text-xs text-foreground/60">
                비공개
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/60">
            {genderLabel[breeder.gender]}
            {breeder.morph ? ` · ${breeder.morph}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-sm font-medium text-foreground/70 hover:text-foreground"
          >
            수정
          </button>
          <DeleteBreederButton id={breeder.id} name={breeder.name} />
        </div>
      </li>

      <Modal open={open} onClose={() => setOpen(false)} title={`브리더 수정 - ${breeder.name}`}>
        <BreederForm
          action={action}
          breeder={breeder}
          submitLabel="수정하기"
          successMessage="수정되었습니다."
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
