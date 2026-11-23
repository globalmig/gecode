import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저에서 Supabase Storage에 직접 업로드(서명된 URL)할 때만 사용하는 클라이언트.
 * 일반 데이터 조회/변경은 서버 전용 lib/supabase/server.ts를 사용한다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
