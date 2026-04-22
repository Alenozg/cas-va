import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { products } from "@db/schema";
import { eq, like, sql } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        series: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.series) {
        conditions.push(eq(products.series, input.series));
      }
      if (input?.search) {
        conditions.push(like(products.title, `%${input.search}%`));
      }

      let query = db.select().from(products);
      if (conditions.length > 0) {
        query = query.where(conditions[0]) as typeof query;
      }

      const result = await query.limit(input?.limit || 50).offset(input?.offset || 0);
      return result;
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(products).where(eq(products.id, input.id));
      return result[0] || null;
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
    const result = await db
      .select({
        series: products.series,
        count: sql<number>`COUNT(*)`,
      })
      .from(products)
      .groupBy(products.series);
    return result;
  }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select({ count: sql<number>`COUNT(*)` }).from(products);
    if (existing[0].count > 0) {
      return { message: "Products already seeded", count: existing[0].count };
    }

    // Read from JSON file
    const fs = await import("fs");
    const path = await import("path");
    const jsonPath = path.resolve(process.cwd(), "public/products.json");
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await db.insert(products).values(
        batch.map((p: any) => ({
          handle: p.id,
          title: p.title,
          series: p.series || "Other",
          description: p.description,
          price: String(p.price),
          compareAtPrice: String(p.compareAtPrice),
          image: p.image,
          badgeColor: p.badgeColor,
          tags: p.tags?.join(", ") || "",
          models: p.models?.join(", ") || "",
        }))
      );
    }

    return { message: "Products seeded successfully", count: data.length };
  }),
});
