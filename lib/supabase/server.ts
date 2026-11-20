import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

/** 서버 컴포넌트/액션에서 사용하는 Supabase 클라이언트. 쿠키 기반으로 로그인 세션을 유지한다. */
export async function createClient() {
  // Supabase 클라이언트 내부에서 세션 만료 체크 시 Date.now()를 호출하는데,
  // 이 값은 캐시/프리렌더링 중에 평가될 수 없다. connection()으로 미리 동적 렌더링임을
  // 표시해 해당 Date.now() 호출이 prerender 단계가 아닌 요청 시점에서 평가되도록 한다.
  await connection();
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출된 경우 쿠키를 쓸 수 없다. proxy.ts가 세션을 갱신한다.
          }
        },
      },
    },
  );
}
