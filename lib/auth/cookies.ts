import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

const base = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export async function setAccessCookie(token: string) {
  (await cookies()).set("access_token", token, { ...base, maxAge: 60 * 15 });
}

export async function setRefreshCookie(token: string) {
  (await cookies()).set("refresh_token", token, { ...base, maxAge: 60 * 60 * 24 * 30 });
}

export async function setFlowCookie(token: string) {
  (await cookies()).set("otp_session", token, { ...base, maxAge: 60 * 10 });
}

export async function setResetCookie(token: string) {
  (await cookies()).set("reset_token", token, { ...base, maxAge: 60 * 10 });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete("access_token");
  store.delete("refresh_token");
}

export async function clearFlowCookie() {
  (await cookies()).delete("otp_session");
}

export async function clearResetCookie() {
  (await cookies()).delete("reset_token");
}