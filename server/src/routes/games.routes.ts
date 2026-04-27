import { Router } from "express";

import {
  getGameDetails,
  getGameHistory,
  getTopGames,
} from "../controllers/games.controller";

const router = Router();

router.get(
  "/games",
  getTopGames
);

router.get(
  "/game/:id",
  getGameDetails
);

router.get(
  "/game/:id/history",
  getGameHistory
);

export default router;