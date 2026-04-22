import "dotenv/config";

const REQUIRED_VARS = ["APP_ID", "APP_SECRET", "DATABASE_URL", "KIMI_AUTH_URL", "KIMI_OPEN_URL"];

// Warn at startup about missing vars — but don't crash.
// Set these in Railway → Service → Variables.
if (process.env.NODE_ENV === "production") {
  const missing = REQUIRED_VARS.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.warn(
      `⚠️  Missing environment variables: ${missing.join(", ")}\n` +
      `   Set these in Railway → Service → Variables.\n` +
      `   The server will start but affected features won't work.`
    );
  }
}

function get(name: string): string {
  return process.env[name] ?? "";
}

export const env = {
  get appId() { return get("APP_ID"); },
  get appSecret() { return get("APP_SECRET"); },
  get isProduction() { return process.env.NODE_ENV === "production"; },
  get databaseUrl() { return get("DATABASE_URL"); },
  get kimiAuthUrl() { return get("KIMI_AUTH_URL"); },
  get kimiOpenUrl() { return get("KIMI_OPEN_URL"); },
  get ownerUnionId() { return get("OWNER_UNION_ID"); },
};
