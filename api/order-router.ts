import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(2),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string().min(5),
        city: z.string().min(2),
        postalCode: z.string().optional(),
        totalAmount: z.number().positive(),
        items: z.array(
          z.object({
            productId: z.number(),
            title: z.string(),
            price: z.number(),
            quantity: z.number(),
            model: z.string(),
            image: z.string().optional(),
          })
        ),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const orderNumber = `CV${Date.now().toString(36).toUpperCase()}`;

      await db.insert(orders).values({
        orderNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        shippingAddress: input.shippingAddress,
        city: input.city,
        postalCode: input.postalCode,
        totalAmount: String(input.totalAmount),
        status: "pending",
        items: input.items as any,
        notes: input.notes,
      });

      return { success: true, orderNumber };
    }),

  list: adminQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return result;
  }),

  byId: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id));
      return result[0] || null;
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const totalOrders = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders);
    const totalRevenue = await db
      .select({ total: sql<number>`SUM(CAST(totalAmount AS DECIMAL(10,2)))` })
      .from(orders);
    const pendingOrders = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(eq(orders.status, "pending"));

    return {
      totalOrders: totalOrders[0]?.count || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders: pendingOrders[0]?.count || 0,
    };
  }),
});
