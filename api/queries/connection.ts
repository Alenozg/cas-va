import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>> | null = null;

export function getDb() {
  if (!instance) {
    const url = env.databaseUrl;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Please add a MySQL database in Railway and set the DATABASE_URL environment variable."
      );
    }
    instance = drizzle(url, {
      mode: "planetscale",
      schema: fullSchema,
    });
  }
  return instance;
}
