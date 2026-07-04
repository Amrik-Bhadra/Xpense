import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { compareOtp } from "@/lib/auth/otp";
import { verifyFlowToken, signAccessToken, signRefreshToken, signFlowToken } from "@/lib/auth/tokens";
import { clearFlowCookie, setAccessCookie, setRefreshCookie, setResetCookie } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
    }

    const flowCookie = (await cookies()).get("otp_session")?.value;
    if (!flowCookie) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    let flow;
    try {
      flow = await verifyFlowToken(flowCookie);
    } catch {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const otpRecord = await prisma.otp.findFirst({
      where: { email: flow.email, purpose: flow.purpose, consumedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "Code expired. Please request a new one." }, { status: 401 });
    }
    if (otpRecord.attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    const valid = await compareOtp(code, otpRecord.codeHash);
    if (!valid) {
      await prisma.otp.update({ where: { id: otpRecord.id }, data: { attempts: { increment: 1 } } });
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 401 });
    }

    await prisma.otp.update({ where: { id: otpRecord.id }, data: { consumedAt: new Date() } });
    await clearFlowCookie();

    if (flow.purpose === "REGISTER") {
      const user = await prisma.user.update({
        where: { email: flow.email },
        data: { emailVerified: new Date() },
      });

      const accessToken = await signAccessToken({ sub: user.id, email: user.email });
      const refreshToken = await signRefreshToken({ sub: user.id, email: user.email });
      await setAccessCookie(accessToken);
      await setRefreshCookie(refreshToken);

      return NextResponse.json({ message: "Email verified.", redirect: "/dashboard" });
    }

    const resetToken = await signFlowToken({ email: flow.email, purpose: "RESET_PASSWORD" }, "10m");
    await setResetCookie(resetToken);

    return NextResponse.json({ message: "Code verified.", redirect: "/reset-password" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}