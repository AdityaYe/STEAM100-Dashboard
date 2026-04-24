import { Router } from "express";

import {
  upsertRating,
  getGameRatings,
  clearRating,
} from "../controllers/rating.controller";

import { ratingsLimiter } from "../middleware/rateLimit.middleware";

import { protect, optionalAuth } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/:appId",
  optionalAuth,
  ratingsLimiter,
  getGameRatings
);

router.post(
  "/",
  protect,
  ratingsLimiter,
  upsertRating
);

router.delete(
  "/",
  protect,
  clearRating
);

export default router;