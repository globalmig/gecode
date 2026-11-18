"use client";

import { useState } from "react";
import { BreederForm } from "./BreederForm";
import { Modal } from "./Modal";
import { createBreeder } from "@/app/api/admin/breeders/actions";

export function NewBreederButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        새 브리더 등록
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="새 브리더 등록">
        <BreederForm
          action={createBreeder}
          submitLabel="등록하기"
          successMessage="등록되었습니다."
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
