const isDev =
  process.env.NODE_ENV !== "production";

export const logger = {
  info: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    console.error(...args);
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },
};