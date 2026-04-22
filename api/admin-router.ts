import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const adminRouter = createRouter({
  customers: adminQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ id: users.id, email: users.email, name: users.name, role: users.role, createdAt: users.createdAt, lastSignInAt: users.lastSignInAt })
      .from(users)
      .orderBy(desc(users.createdAt));
    return result;
  }),

  setRole: adminQuery
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      return { success: true };
    }),
});
