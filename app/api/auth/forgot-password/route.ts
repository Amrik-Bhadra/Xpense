import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/auth/otp";
import { signFlowToken } from "@/lib/auth/tokens";
import { setFlowCookie } from "@/lib/auth/cookies";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 },
      );
    }

    const code = generateOtp();
    const codeHash = await hashOtp(code);
    await prisma.otp.create({
      data: {
        email: user.email,
        codeHash,
        purpose: "RESET_PASSWORD",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await sendOtpEmail(user.email, code, "RESET_PASSWORD");

    const flowToken = await signFlowToken({ email: user.email, purpose: "RESET_PASSWORD" });
    await setFlowCookie(flowToken);

    return NextResponse.json({ message: "Reset code sent." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}