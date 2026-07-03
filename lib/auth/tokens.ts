import { SignJWT, jwtVerify } from "jose";

const encoder = new TextEncoder();
const ACCESS_SECRET = encoder.encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = encoder.encode(process.env.JWT_REFRESH_SECRET!);
const FLOW_SECRET = encoder.encode(process.env.JWT_FLOW_SECRET!);

export type AccessPayload = { sub: string; email: string };
export type FlowPayload = { email: string; purpose: "REGISTER" | "RESET_PASSWORD" };

export async function signAccessToken(payload: AccessPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: AccessPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, ACCESS_SECRET);
  return payload as AccessPayload & { exp: number; iat: number };
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, REFRESH_SECRET);
  return payload as AccessPayload & { exp: number; iat: number };
}

export async function signFlowToken(payload: FlowPayload, expiresIn = "10m") {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(FLOW_SECRET);
}

export async function verifyFlowToken(token: string) {
  const { payload } = await jwtVerify(token, FLOW_SECRET);
  return payload as FlowPayload & { exp: number; iat: number };
}