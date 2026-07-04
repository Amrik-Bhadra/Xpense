import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken, signFlowToken } from "@/lib/auth/tokens";
import { setAccessCookie, setRefreshCookie, setFlowCookie } from "@/lib/auth/cookies";
import { generateOtp, hashOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email?.trim() || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.emailVerified) {
      const code = generateOtp();
      const codeHash = await hashOtp(code);
      await prisma.otp.create({
        data: {
          email: user.email,
          codeHash,
          purpose: "REGISTER",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });
      await sendOtpEmail(user.email, code, "REGISTER");

      const flowToken = await signFlowToken({ email: user.email, purpose: "REGISTER" });
      await setFlowCookie(flowToken);

      return NextResponse.json(
        { error: "Please verify your email first.", redirect: "/verify-otp" },
        { status: 403 },
      );
    }

    const accessToken = await signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = await signRefreshToken({ sub: user.id, email: user.email });
    await setAccessCookie(accessToken);
    await setRefreshCookie(refreshToken);

    return NextResponse.json({ message: "Logged in.", redirect: "/dashboard" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}