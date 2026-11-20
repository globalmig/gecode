import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BreederListItem } from "@/components/admin/BreederListItem";
import { NewBreederButton } from "@/components/admin/NewBreederButton";
import { listBreedersPage, listBreederOptions } from "@/lib/breeders/queries";
import type { Breeder, BreederOption, BreederWithParents } from "@/lib/breeders/types";

export const metadata: Metadata = {
  title: "브리더 관리",
};

const PAGE_SIZE = 10;

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const params = await searchParams;
  const rawPage = Number(Array.isArray(params.page) ? params.page[0] : params.page);
  const requestedPage = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;

  let breeders: Breeder[] = [];
  let total = 0;
  let parentOptions: BreederOption[] = [];
  let loadError: string | null = null;

  try {
    const [page, options] = await Promise.all([
      listBreedersPage(requestedPage, PAGE_SIZE),
      listBreederOptions(),
    ]);
    breeders = page.breeders;
    total = page.total;
    parentOptions = options;
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "브리더 목록을 불러오는 중 오류가 발생했습니다.";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);

  const optionById = new Map(parentOptions.map((option) => [option.id, option]));
  const breedersWithParents: BreederWithParents[] = breeders.map((breeder) => ({
    ...breeder,
    father: breeder.father_id ? optionById.get(breeder.father_id) ?? null : null,
    mother: breeder.mother_id ? optionById.get(breeder.mother_id) ?? null : null,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminHeader title="브리더 소개 관리" />

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          브리더 소개 페이지에 노출되는 개체 정보를 등록, 수정, 삭제할 수 있습니다.
        </p>
        <NewBreederButton parentOptions={parentOptions} />
      </div>

      {loadError && (
        <p className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </p>
      )}

      {!loadError && breedersWithParents.length === 0 && (
        <p className="rounded border border-foreground/10 p-6 text-center text-sm text-foreground/50">
          등록된 브리더가 없습니다. &apos;새 브리더 등록&apos;으로 첫 개체를 추가해보세요.
        </p>
      )}

      {!loadError && breedersWithParents.length > 0 && (
        <ul className="flex flex-col divide-y divide-foreground/10 rounded border border-foreground/10">
          {breedersWithParents.map((breeder) => (
            <BreederListItem
              key={breeder.id}
              breeder={breeder}
              parentOptions={parentOptions.filter((option) => option.id !== breeder.id)}
            />
          ))}
        </ul>
      )}

      {!loadError && totalPages > 1 && (
        <AdminPagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}

function AdminPagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="브리더 목록 페이지" className="flex items-center justify-center gap-1.5">
      <PageLink page={currentPage - 1} disabled={currentPage <= 1}>
        이전
      </PageLink>

      {pages.map((page) => (
        <Link
          key={page}
          href={`/admin?page=${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-medium ${
            page === currentPage
              ? "bg-accent text-white"
              : "text-foreground/70 hover:bg-foreground/5"
          }`}
        >
          {page}
        </Link>
      ))}

      <PageLink page={currentPage + 1} disabled={currentPage >= totalPages}>
        다음
      </PageLink>
    </nav>
  );
}

function PageLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="flex h-8 items-center justify-center rounded px-3 text-sm text-foreground/30">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={`/admin?page=${page}`}
      className="flex h-8 items-center justify-center rounded px-3 text-sm font-medium text-foreground/70 hover:bg-foreground/5"
    >
      {children}
    </Link>
  );
}
