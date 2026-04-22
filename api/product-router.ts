import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, like, sql, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(z.object({
      series: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().min(1).max(200).default(50),
      offset: z.number().min(0).default(0),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      let query = db.select().from(products).orderBy(desc(products.createdAt)) as any;
      if (input?.series) query = query.where(eq(products.series, input.series));
      if (input?.search) query = db.select().from(products).where(like(products.title, `%${input.search}%`));
      const result = await query.limit(input?.limit ?? 50).offset(input?.offset ?? 0);
      return result;
    }),

  byHandle: publicQuery
    .input(z.object({ handle: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.handle, input.handle));
      return result[0] || null;
    }),

  series: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.select({ series: products.series, count: sql<number>`COUNT(*)` }).from(products).groupBy(products.series);
    return result;
  }),

  adminList: adminQuery
    .input(z.object({ search: z.string().optional(), limit: z.number().default(50), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const total = await db.select({ count: sql<number>`COUNT(*)` }).from(products);
      let items;
      if (input?.search) {
        items = await db.select().from(products).where(like(products.title, `%${input.search}%`)).limit(input.limit).offset(input.offset);
      } else {
        items = await db.select().from(products).orderBy(desc(products.createdAt)).limit(input?.limit ?? 50).offset(input?.offset ?? 0);
      }
      return { items, total: Number(total[0]?.count ?? 0) };
    }),

  updatePrice: adminQuery
    .input(z.object({ id: z.number(), price: z.string(), compareAtPrice: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(products).set({ price: input.price, compareAtPrice: input.compareAtPrice }).where(eq(products.id, input.id));
      return { success: true };
    }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select({ count: sql<number>`COUNT(*)` }).from(products);
    if (Number(existing[0].count) > 0) return { message: "Already seeded", count: existing[0].count };
    const fs = await import("fs");
    const path = await import("path");
    const jsonPath = path.resolve(process.cwd(), "public/products.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await db.insert(products).values(batch.map((p: any) => ({
        handle: p.id, title: p.title, series: p.series || "Other",
        description: p.description, price: String(p.price),
        compareAtPrice: String(p.compareAtPrice), image: p.image,
        badgeColor: p.badgeColor, tags: p.tags?.join(", ") || "", models: p.models?.join(", ") || "",
      })));
    }
    return { message: "Seeded", count: data.length };
  }),
});
