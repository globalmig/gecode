"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ParentPicker } from "./ParentPicker";
import { BreederImageField } from "./BreederImageField";
import type { BreederOption, BreederWithParents } from "@/lib/breeders/types";
import type { BreederFormState } from "@/lib/breeders/schema";

type Action = (state: BreederFormState, formData: FormData) => Promise<BreederFormState>;

type Props = {
  action: Action;
  breeder?: BreederWithParents;
  parentOptions: BreederOption[];
  submitLabel: string;
  successMessage: string;
  onSuccess?: () => void;
};

const initialState: BreederFormState = {};

export function BreederForm({
  action,
  breeder,
  parentOptions,
  submitLabel,
  successMessage,
  onSuccess,
}: Props) {
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
        const form = event.currentTarget;
        const name = (form.elements.namedItem("name") as HTMLInputElement | null)?.value.trim();
        if (!name) {
          event.preventDefault();
          alert("이름(코드명)을 입력해주세요.");
          return;
        }

        const englishName = (
          form.elements.namedItem("englishName") as HTMLInputElement | null
        )?.value.trim();
        if (!englishName) {
          event.preventDefault();
          alert("영문명을 입력해주세요.");
          return;
        }

        const imageInput = form.elements.namedItem("image") as HTMLInputElement | null;
        const hasNewImage = !!imageInput?.files?.length;
        if (!hasNewImage && !breeder?.image_url) {
          event.preventDefault();
          alert("사진을 등록해주세요.");
        }
      }}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="이름(코드명)" required error={state.fieldErrors?.name}>
          <input
            name="name"
            defaultValue={breeder?.name}
            maxLength={50}
            className="input"
          />
        </Field>

        <Field label="영문명" required error={state.fieldErrors?.englishName}>
          <input
            name="englishName"
            defaultValue={breeder?.english_name ?? ""}
            maxLength={50}
            className="input"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="성별" required error={state.fieldErrors?.gender}>
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

        <Field label="성장 단계" required error={state.fieldErrors?.stage}>
          <select
            name="stage"
            defaultValue={breeder?.stage ?? "adult"}
            className="input"
          >
            <option value="adult">성체</option>
            <option value="baby">베이비</option>
          </select>
        </Field>
      </div>

      <Field label="모프" error={state.fieldErrors?.morph}>
        <input
          name="morph"
          defaultValue={breeder?.morph ?? ""}
          maxLength={50}
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ParentPicker
          name="fatherId"
          label="부(父) 개체"
          options={parentOptions}
          initial={breeder?.father ?? null}
          error={state.fieldErrors?.fatherId}
        />
        <ParentPicker
          name="motherId"
          label="모(母) 개체"
          options={parentOptions}
          initial={breeder?.mother ?? null}
          error={state.fieldErrors?.motherId}
        />
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

      <BreederImageField currentImageUrl={breeder?.image_url ?? null} />

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
