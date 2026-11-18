import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">관리자 로그인</h1>
        <p className="text-sm text-foreground/60">
          아이디와 비밀번호를 입력해 관리자 페이지에 접속하세요.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
