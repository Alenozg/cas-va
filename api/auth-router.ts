import { z } from "zod";
import * as cookie from "cookie";
import { TRPCError } from "@trpc/server";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, authedQuery, publicQuery } from "./middleware";
import { findUserByEmail, createUser, updateLastSignIn } from "./queries/users";
import { hashPassword, verifyPassword } from "./auth/password";
import { signSessionToken } from "./auth/session";
import { clearSessionCookie } from "./auth";

const registerInput = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  name: z.string().min(1, "İsim zorunlu").max(100),
});

const loginInput = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(1, "Şifre zorunlu"),
});

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  register: publicQuery
    .input(registerInput)
    .mutation(async ({ input, ctx }) => {
      const existing = await findUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "Bu email zaten kayıtlı" });
      }
      const passwordHash = await hashPassword(input.password);
      const user = await createUser({
        email: input.email,
        passwordHash,
        name: input.name,
        lastSignInAt: new Date(),
      });
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Kayıt başarısız" });

      const token = await signSessionToken({ userId: user.id, email: user.email });
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }),

  login: publicQuery
    .input(loginInput)
    .mutation(async ({ input, ctx }) => {
      const user = await findUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email veya şifre hatalı" });
      }
      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Email veya şifre hatalı" });
      }
      await updateLastSignIn(user.id);

      const token = await signSessionToken({ userId: user.id, email: user.email });
      const cookieOpts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: cookieOpts.httpOnly,
          path: cookieOpts.path,
          sameSite: cookieOpts.sameSite?.toLowerCase() as "lax" | "none",
          secure: cookieOpts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }),

  logout: authedQuery.mutation(async ({ ctx }) => {
    ctx.resHeaders.append("set-cookie", clearSessionCookie(ctx.req.headers));
    return { success: true };
  }),
});
