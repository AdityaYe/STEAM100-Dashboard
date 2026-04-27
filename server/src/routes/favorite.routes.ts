import { Router } from "express";

import {
  getFavorites,
  toggleFavorite,
} from "../controllers/favorite.controller";

import { protect } from "../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  protect,
  getFavorites
);

router.post(
  "/",
  protect,
  toggleFavorite
);

export default router;