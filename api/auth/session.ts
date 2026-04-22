import * as jose from "jose";
import { env } from "../lib/env";

const JWT_ALG = "HS256";
const SESSION_MAX_AGE = "1 year";

export interface SessionPayload {
  userId: number;
  email: string;
}

function getSecret() {
  const secret = env.appSecret || "dev-secret-change-in-production";
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return new jose.SignJWT(payload as unknown as jose.JWTPayload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(SESSION_MAX_AGE)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, getSecret(), {
      algorithms: [JWT_ALG],
    });
    const { userId, email } = payload as unknown as SessionPayload;
    if (!userId || !email) return null;
    return { userId: Number(userId), email: String(email) };
  } catch {
    return null;
  }
}
