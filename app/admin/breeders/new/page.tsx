import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BreederForm } from "@/components/admin/BreederForm";
import { createBreeder } from "@/app/api/admin/breeders/actions";
import { listBreederOptions } from "@/lib/breeders/queries";

export const metadata: Metadata = {
  title: "새 브리더 등록",
};

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
