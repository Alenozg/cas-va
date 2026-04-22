import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cartItems, products } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const cartRouter = createRouter({
  get: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const items = await db
        .select({
          id: cartItems.id,
          productId: cartItems.productId,
          model: cartItems.model,
          quantity: cartItems.quantity,
          title: products.title,
          price: products.price,
          image: products.image,
          series: products.series,
          badgeColor: products.badgeColor,
        })
        .from(cartItems)
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.sessionId, input.sessionId));
      return items;
    }),

  add: publicQuery
    .input(
      z.object({
        sessionId: z.string(),
        productId: z.number(),
        model: z.string(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.sessionId, input.sessionId),
            eq(cartItems.productId, input.productId),
            eq(cartItems.model, input.model)
          )
        );

      if (existing.length > 0) {
        await db
          .update(cartItems)
          .set({ quantity: existing[0].quantity + input.quantity })
          .where(eq(cartItems.id, existing[0].id));
        return { success: true, action: "updated" };
      }

      await db.insert(cartItems).values({
        sessionId: input.sessionId,
        productId: input.productId,
        model: input.model,
        quantity: input.quantity,
      });
      return { success: true, action: "added" };
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(eq(cartItems.id, input.id));
      return { success: true };
    }),

  remove: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.id, input.id));
      return { success: true };
    }),

  clear: publicQuery
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cartItems).where(eq(cartItems.sessionId, input.sessionId));
      return { success: true };
    }),
});
