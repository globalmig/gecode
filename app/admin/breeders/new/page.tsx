import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BreederForm } from "@/components/admin/BreederForm";
import { createBreeder } from "@/app/api/admin/breeders/actions";
import { listBreederOptions } from "@/lib/breeders/queries";

export const metadata: Metadata = {
  title: "새 브리더 등록",
};

// 로그인 세션 쿠키를 읽는 Supabase 클라이언트로 매 요청 조회하므로 instant navigation 검증 대상에서 제외한다.
export const instant = false;

export default async function NewBreederPage() {
  const parentOptions = await listBreederOptions();

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="새 브리더 등록" />
      <BreederForm
        action={createBreeder}
        parentOptions={parentOptions}
        submitLabel="등록하기"
        successMessage="등록되었습니다."
      />
    </div>
  );
}
