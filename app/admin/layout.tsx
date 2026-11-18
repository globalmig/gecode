import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

// 관리자 영역은 매 요청마다 최신 데이터를 보여줘야 하므로 instant navigation 최적화 대상에서 제외한다.
export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="mx-auto min-h-full max-w-360 px-5 py-10">{children}</div>;
}
