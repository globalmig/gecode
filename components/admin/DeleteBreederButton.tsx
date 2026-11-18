"use client";

import { useTransition } from "react";
import { deleteBreeder } from "@/app/api/admin/breeders/actions";

export function DeleteBreederButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`'${name}' 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
          return;
        }
        startTransition(async () => {
          try {
            await deleteBreeder(id);
            alert("삭제되었습니다.");
          } catch (error) {
            alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
          }
        });
      }}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "삭제 중..." : "삭제"}
    </button>
  );
}
