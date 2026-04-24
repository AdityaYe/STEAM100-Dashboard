import rateLimit from "express-rate-limit";

const isDev =
  process.env.NODE_ENV ===
  "development";

export const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max: isDev
      ? 9999
      : 25,
    message: {
      success: false,
      message:
        "Too many auth attempts. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const actionLimiter =
  rateLimit({
    windowMs:
      1 * 60 * 1000,
    max: isDev
      ? 9999
      : 80,
    message: {
      success: false,
      message:
        "Too many requests. Slow down.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const publicLimiter =
  rateLimit({
    windowMs:
      1 * 60 * 1000,
    max: isDev
      ? 9999
      : 300,
    message: {
      success: false,
      message:
        "Too many requests. Please retry shortly.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

export const ratingsLimiter =
  rateLimit({
    windowMs:
      1 * 60 * 1000,
    max: isDev
      ? 9999
      : 150,
    message: {
      success: false,
      message:
        "Too many rating requests.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });