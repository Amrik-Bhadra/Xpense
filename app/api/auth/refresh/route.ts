import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, signAccessToken } from "@/lib/auth/tokens";
import { setAccessCookie } from "@/lib/auth/cookies";

export async function POST() {
  const refreshToken = (await cookies()).get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken({ sub: payload.sub, email: payload.email });
    await setAccessCookie(accessToken);
    return NextResponse.json({ message: "Refreshed." });
  } catch {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }
}