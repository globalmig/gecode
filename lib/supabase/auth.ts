/**
 * Supabase Auth는 이메일 형식을 요구하므로, 화면에서 입력받은 "아이디"를
 * 내부용 가짜 이메일(아이디@ADMIN_EMAIL_DOMAIN)로 변환해 로그인한다.
 * 실제로 메일이 발송되지 않는 도메인이므로 실존 도메인을 쓰지 않는다.
 */
const ADMIN_EMAIL_DOMAIN = "admin.gecode.local";

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${ADMIN_EMAIL_DOMAIN}`;
}
