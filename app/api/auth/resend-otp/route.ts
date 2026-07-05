import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp } from "@/lib/auth/otp";
import { verifyFlowToken, signFlowToken } from "@/lib/auth/tokens";
import { setFlowCookie } from "@/lib/auth/cookies";
import { sendOtpEmail } from "@/lib/helpers/mailer";

export async function POST() {
  try {
    const flowCookie = (await cookies()).get("otp_session")?.value;
    if (!flowCookie) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    const flow = await verifyFlowToken(flowCookie);

    const code = generateOtp();
    const codeHash = await hashOtp(code);

    await prisma.otp.create({
      data: {
        email: flow.email,
        codeHash,
        purpose: flow.purpose,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail(flow.email, code, flow.purpose);

    const refreshedFlow = await signFlowToken({ email: flow.email, purpose: flow.purpose });
    await setFlowCookie(refreshedFlow);

    return NextResponse.json({ message: "A new code has been sent." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
  }
}