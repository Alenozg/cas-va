import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, users } from "@db/schema";
import { eq, desc, sql, gte, and } from "drizzle-orm";

export const orderRouter = createRouter({
  create: publicQuery
    .input(z.object({
      customerName: z.string().min(2),
      customerEmail: z.string().email(),
      customerPhone: z.string().optional(),
      shippingAddress: z.string().min(5),
      city: z.string().min(2),
      postalCode: z.string().optional(),
      totalAmount: z.number().positive(),
      items: z.array(z.object({
        productId: z.number(),
        title: z.string(),
        price: z.number(),
        quantity: z.number(),
        model: z.string(),
        image: z.string().optional(),
      })),
      notes: z.string().optional(),
    }))
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

  list: adminQuery
    .input(z.object({
      status: z.enum(["all", "pending", "processing", "shipped", "delivered", "cancelled"]).default("all"),
      search: z.string().optional(),
      limit: z.number().default(50),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(orders).orderBy(desc(orders.createdAt));
      const result = await query.limit(input?.limit ?? 50).offset(input?.offset ?? 0);
      let filtered = result;
      if (input?.status && input.status !== "all") {
        filtered = filtered.filter(o => o.status === input.status);
      }
      if (input?.search) {
        const s = input.search.toLowerCase();
        filtered = filtered.filter(o =>
          o.customerName.toLowerCase().includes(s) ||
          o.orderNumber.toLowerCase().includes(s) ||
          o.customerEmail.toLowerCase().includes(s)
        );
      }
      return filtered;
    }),

  byId: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(orders).where(eq(orders.id, input.id));
      return result[0] || null;
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status, updatedAt: new Date() }).where(eq(orders.id, input.id));
      return { success: true };
    }),

  stats: adminQuery.query(async () => {
    const db = getDb();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [allOrders, monthOrders, lastMonthOrders, pendingOrders, customerCount] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)`, total: sql<number>`SUM(CAST(totalAmount AS DECIMAL(10,2)))` }).from(orders),
      db.select({ count: sql<number>`COUNT(*)`, total: sql<number>`SUM(CAST(totalAmount AS DECIMAL(10,2)))` }).from(orders).where(gte(orders.createdAt, startOfMonth)),
      db.select({ count: sql<number>`COUNT(*)`, total: sql<number>`SUM(CAST(totalAmount AS DECIMAL(10,2)))` }).from(orders).where(and(gte(orders.createdAt, startOfLastMonth), sql`${orders.createdAt} <= ${endOfLastMonth}`)),
      db.select({ count: sql<number>`COUNT(*)` }).from(orders).where(eq(orders.status, "pending")),
      db.select({ count: sql<number>`COUNT(*)` }).from(users),
    ]);

    const thisMonthRevenue = Number(monthOrders[0]?.total ?? 0);
    const lastMonthRevenue = Number(lastMonthOrders[0]?.total ?? 0);
    const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    // Recent orders for chart (last 7 days)
    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const salesByDay = last7Days.map(day => ({
      date: day,
      orders: recentOrders.filter(o => o.createdAt.toISOString().split("T")[0] === day).length,
      revenue: recentOrders.filter(o => o.createdAt.toISOString().split("T")[0] === day).reduce((s, o) => s + Number(o.totalAmount), 0),
    }));

    const byStatus = {
      pending: recentOrders.filter(o => o.status === "pending").length,
      processing: recentOrders.filter(o => o.status === "processing").length,
      shipped: recentOrders.filter(o => o.status === "shipped").length,
      delivered: recentOrders.filter(o => o.status === "delivered").length,
      cancelled: recentOrders.filter(o => o.status === "cancelled").length,
    };

    return {
      totalOrders: Number(allOrders[0]?.count ?? 0),
      totalRevenue: Number(allOrders[0]?.total ?? 0),
      monthOrders: Number(monthOrders[0]?.count ?? 0),
      monthRevenue: thisMonthRevenue,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      pendingOrders: Number(pendingOrders[0]?.count ?? 0),
      totalCustomers: Number(customerCount[0]?.count ?? 0),
      salesByDay,
      byStatus,
    };
  }),
});
