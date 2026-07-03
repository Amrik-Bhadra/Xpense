import crypto from "crypto";
import bcrypt from "bcryptjs";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOtp(code: string) {
  return bcrypt.hash(code, 10);
}

export function compareOtp(code: string, hash: string) {
  return bcrypt.compare(code, hash);
}