import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { verifyFlowToken } from "@/lib/auth/tokens";
import { clearResetCookie } from "@/lib/auth/cookies";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const resetCookie = (await cookies()).get("reset_token")?.value;
    if (!resetCookie) {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }

    let flow;
    try {
      flow = await verifyFlowToken(resetCookie);
    } catch {
      return NextResponse.json({ error: "Session expired. Please start again." }, { status: 401 });
    }
    if (flow.purpose !== "RESET_PASSWORD") {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    const hashedPassword = await hashPassword(password);
    await prisma.user.update({
      where: { email: flow.email },
      data: { password: hashedPassword },
    });

    await clearResetCookie();

    return NextResponse.json({ message: "Password updated. Please log in.", redirect: "/login" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}