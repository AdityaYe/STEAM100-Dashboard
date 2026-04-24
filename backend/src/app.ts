import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import gamesRoutes from "./routes/games.routes";
import authRoutes from "./routes/auth.routes";
import ratingRoutes from "./routes/rating.routes";
import favoriteRoutes from "./routes/favorite.routes";

import { errorHandler } from "./middleware/error.middleware";
import { authLimiter, actionLimiter, publicLimiter } from "./middleware/rateLimit.middleware";

import "./config/passport";

const app = express();

app.use(helmet());

/* core middleware */
app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true,
  })
);

app.use(express.json());
app.set("trust proxy", 1);

/* routes */
app.use("/api", publicLimiter, gamesRoutes);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/ratings",
  actionLimiter,
  ratingRoutes
);

app.use(
  "/api/favorites",
  actionLimiter,
  favoriteRoutes
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);

app.use(cookieParser());

app.use(errorHandler);

export default app;