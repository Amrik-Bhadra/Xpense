import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyFlowToken } from "@/lib/auth/tokens";

function mask(email: string) {
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user.slice(0, 2)}${"*".repeat(Math.max(user.length - 2, 3))}@${domain}`;
}

export async function GET() {
  const token = (await cookies()).get("otp_session")?.value;
  if (!token) return NextResponse.json({ error: "No active session." }, { status: 401 });

  try {
    const flow = await verifyFlowToken(token);
    return NextResponse.json({ email: mask(flow.email), purpose: flow.purpose });
  } catch {
    return NextResponse.json({ error: "Session expired." }, { status: 401 });
  }
}