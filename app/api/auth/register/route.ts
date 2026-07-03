import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { generateOtp, hashOtp } from "@/lib/auth/otp";
import { signFlowToken } from "@/lib/auth/tokens";
import { setFlowCookie } from "@/lib/auth/cookies";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existing?.emailVerified) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = existing
      ? await prisma.user.update({
          where: { email: normalizedEmail },
          data: { name: name.trim(), password: hashedPassword },
        })
      : await prisma.user.create({
          data: { name: name.trim(), email: normalizedEmail, password: hashedPassword },
        });

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

    return NextResponse.json({ message: "Verification code sent to your email." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}