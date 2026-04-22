import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "../lib/cookies";
import { verifySessionToken } from "./session";
import { findUserByEmail } from "../queries/users";

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) return null;

  const claim = await verifySessionToken(token);
  if (!claim) return null;

  const user = await findUserByEmail(claim.email);
  return user ?? null;
}

export function clearSessionCookie(headers: Headers): string {
  const opts = getSessionCookieOptions(headers);
  return cookie.serialize(Session.cookieName, "", {
    httpOnly: opts.httpOnly,
    path: opts.path,
    sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
    secure: opts.secure,
    maxAge: 0,
  });
}
