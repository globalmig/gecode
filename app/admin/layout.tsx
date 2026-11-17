import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="mx-auto min-h-full max-w-360 px-5 py-10">{children}</div>;
}
