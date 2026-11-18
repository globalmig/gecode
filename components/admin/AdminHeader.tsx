import Link from "next/link";
import { logout } from "@/app/api/admin/auth/actions";

export function AdminHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-sm font-semibold text-foreground/60 hover:text-foreground">
          관리자
        </Link>
        <span className="text-foreground/30">/</span>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="text-sm font-medium text-foreground/60 hover:text-foreground"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
