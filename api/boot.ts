import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

// Startup: log missing env vars without crashing
const REQUIRED_VARS = ["APP_ID", "APP_SECRET", "DATABASE_URL", "KIMI_AUTH_URL", "KIMI_OPEN_URL"];
const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
if (missing.length > 0) {
  console.warn("⚠️  Missing environment variables:", missing.join(", "));
  console.warn("   Set these in Railway → Service → Variables.");
  console.warn("   The server will start but affected features won't work.");
}

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.get("/api/health", (c) => c.json({ ok: true, ts: Date.now(), missing }));
app.get(Paths.oauthCallback, createOAuthCallbackHandler());
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`🚀 Server running on http://localhost:${port}/`);
    if (missing.length > 0) {
      console.warn(`⚠️  ${missing.length} env var(s) missing — see above.`);
    }
  });
}
