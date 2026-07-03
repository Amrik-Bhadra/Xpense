import { cookies } from "next/headers";
import { verifyAccessToken } from "./tokens";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return null;

  try {
    const payload = await verifyAccessToken(token);
    return await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true },
    });
  } catch {
    return null;
  }
}