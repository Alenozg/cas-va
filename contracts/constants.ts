export const Session = {
  cookieName: "app_sid",
  maxAgeMs: 365 * 24 * 60 * 60 * 1000,
} as const;

export const ErrorMessages = {
  unauthenticated: "Giriş yapmanız gerekiyor",
  insufficientRole: "Bu işlem için yetkiniz yok",
} as const;

export const Paths = {
  login: "/login",
} as const;
