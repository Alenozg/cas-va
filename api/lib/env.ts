import "dotenv/config";

const REQUIRED_VARS = ["APP_SECRET", "DATABASE_URL"];

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
  get appSecret() { return get("APP_SECRET"); },
  get isProduction() { return process.env.NODE_ENV === "production"; },
  get databaseUrl() { return get("DATABASE_URL"); },
  get adminEmail() { return get("ADMIN_EMAIL"); }, // bu email otomatik admin olur
};
