"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { usernameToEmail } from "@/lib/supabase/auth";
import { checkLoginRateLimit, recordLoginFailure, resetLoginAttempts } from "@/lib/admin/login-rate-limit";

export type LoginFormState = {
  error?: string;
};

async function getClientIp() {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "아이디와 비밀번호를 입력해주세요." };
  }

  const rateLimitKey = `${await getClientIp()}:${username.toLowerCase()}`;
  const rateLimit = checkLoginRateLimit(rateLimitKey);
  if (!rateLimit.allowed) {
    const minutes = Math.ceil((rateLimit.retryAfterSeconds ?? 0) / 60);
    return { error: `로그인 시도가 너무 많습니다. ${minutes}분 후 다시 시도해주세요.` };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });

  if (error) {
    recordLoginFailure(rateLimitKey);
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  resetLoginAttempts(rateLimitKey);
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
