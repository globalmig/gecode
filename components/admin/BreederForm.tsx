"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import type { Breeder } from "@/lib/breeders/types";
import type { BreederFormState } from "@/lib/breeders/schema";

type Action = (state: BreederFormState, formData: FormData) => Promise<BreederFormState>;

type Props = {
  action: Action;
  breeder?: Breeder;
  submitLabel: string;
  successMessage: string;
  onSuccess?: () => void;
};

const initialState: BreederFormState = {};

export function BreederForm({ action, breeder, submitLabel, successMessage, onSuccess }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const router = useRouter();
  const pathname = usePathname();
  const lastHandledState = useRef(initialState);

  useEffect(() => {
    if (state === lastHandledState.current) return;
    lastHandledState.current = state;

    if (state.success) {
      alert(successMessage);
      onSuccess?.();
      if (pathname !== "/admin") {
        router.push("/admin");
      } else {
        router.refresh();
      }
    } else if (state.error) {
      alert(state.error);
    }
  }, [state, successMessage, onSuccess, pathname, router]);

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        const name = (event.currentTarget.elements.namedItem("name") as HTMLInputElement | null)
          ?.value.trim();
        if (!name) {
          event.preventDefault();
          alert("이름(코드명)을 입력해주세요.");
        }
      }}
      className="flex flex-col gap-5"
    >
      <Field label="이름(코드명)" required error={state.fieldErrors?.name}>
        <input
          name="name"
          defaultValue={breeder?.name}
          maxLength={50}
          className="input"
        />
      </Field>

      <Field label="영문명" error={state.fieldErrors?.englishName}>
        <input
          name="englishName"
          defaultValue={breeder?.english_name ?? ""}
          maxLength={50}
          className="input"
        />
      </Field>

      <Field label="성별" error={state.fieldErrors?.gender}>
        <select
          name="gender"
          defaultValue={breeder?.gender ?? "unknown"}
          className="input"
        >
          <option value="male">수컷</option>
          <option value="female">암컷</option>
          <option value="unknown">미구분</option>
        </select>
      </Field>

      <Field label="모프" error={state.fieldErrors?.morph}>
        <input
          name="morph"
          defaultValue={breeder?.morph ?? ""}
          maxLength={50}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="부(父) 개체" error={state.fieldErrors?.fatherName}>
          <input
            name="fatherName"
            defaultValue={breeder?.father_name ?? ""}
            maxLength={50}
            className="input"
          />
        </Field>
        <Field label="모(母) 개체" error={state.fieldErrors?.motherName}>
          <input
            name="motherName"
            defaultValue={breeder?.mother_name ?? ""}
            maxLength={50}
            className="input"
          />
        </Field>
      </div>

      <Field label="소개" error={state.fieldErrors?.description}>
        <textarea
          name="description"
          defaultValue={breeder?.description ?? ""}
          maxLength={2000}
          rows={5}
          className="input resize-y"
        />
      </Field>

      <Field label="노출 순서" error={state.fieldErrors?.displayOrder}>
        <input
          name="displayOrder"
          type="number"
          defaultValue={breeder?.display_order ?? 0}
          className="input max-w-32"
        />
      </Field>

      <div className="flex items-center gap-2">
        <input
          id="isPublished"
          name="isPublished"
          type="checkbox"
          defaultChecked={breeder?.is_published ?? true}
          className="h-4 w-4"
        />
        <label htmlFor="isPublished" className="text-sm font-medium">
          브리더 소개 페이지에 공개
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="image" className="text-sm font-medium">
          사진
        </label>
        {breeder?.image_url && (
          <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded border border-foreground/10">
              <Image src={breeder.image_url} alt={breeder.name} fill className="object-cover" />
            </div>
            <label className="flex items-center gap-1.5 text-xs text-foreground/60">
              <input type="checkbox" name="removeImage" className="h-3.5 w-3.5" />
              현재 사진 삭제
            </label>
          </div>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded bg-accent px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "저장 중..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
