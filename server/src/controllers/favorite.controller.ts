import { Response } from "express";

import { Favorite } from "../models/Favorite.models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const toggleFavorite = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user.id;
    const { appId } = req.body;

    if (!appId) {
      throw new AppError("appId is required", 400);
    }

    const existing = await Favorite.findOne({
      userId,
      appId,
    });

    if (existing) {
      await existing.deleteOne();

      return res.json({
        favorited: false,
      });
    }

    await Favorite.create({
      userId,
      appId,
    });

    res.json({
      favortied: true,
    });
  }
);

export const getFavorites = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user._id;

    const favorites = await Favorite.find({
      userId,
    });

    res.json(
      favorites.map((item) => item.appId)
    );
  }
);