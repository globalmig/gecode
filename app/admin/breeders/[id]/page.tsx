import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BreederForm } from "@/components/admin/BreederForm";
import { updateBreeder } from "@/app/api/admin/breeders/actions";
import { getBreeder, listBreederOptions } from "@/lib/breeders/queries";

export const metadata: Metadata = {
  title: "브리더 수정",
};

// 로그인 세션 쿠키를 읽는 Supabase 클라이언트로 매 요청 조회하므로 instant navigation 검증 대상에서 제외한다.
export const instant = false;

export default async function EditBreederPage(
  props: PageProps<"/admin/breeders/[id]">,
) {
  const { id } = await props.params;
  const [breeder, parentOptions] = await Promise.all([getBreeder(id), listBreederOptions(id)]);

  if (!breeder) {
    notFound();
  }

  const action = updateBreeder.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title={`브리더 수정 - ${breeder.name}`} />
      <BreederForm
        action={action}
        breeder={breeder}
        parentOptions={parentOptions}
        submitLabel="수정하기"
        successMessage="수정되었습니다."
      />
    </div>
  );
}
