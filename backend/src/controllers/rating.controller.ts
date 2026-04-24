import { Response } from "express";

import { Rating } from "../models/Rating.models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

export const upsertRating = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user._id;
    const { appId } = req.body;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const update: any = {};
    const unset: any = {};

    if ("rating" in req.body) {
      const rating = req.body.rating;

      if (
        rating === undefined ||
        rating === null ||
        rating === 0
      ) {
        unset.rating = "";
      } else {
        update.rating = Number(rating);
      }
    }

    if ("recommended" in req.body) {
      const recommended = req.body.recommended;

      if (recommended === null) {
        unset.recommended = "";
      } else {
        update.recommended = recommended;
      }
    }

    const query = {
      userId,
      appId: Number(appId),
    };

    const payload: any = {};

    if (Object.keys(update).length) {
      payload.$set = update;
    }

    if (Object.keys(unset).length) {
      payload.$unset = unset;
    }

    const updated =
      await Rating.findOneAndUpdate(
        query,
        payload,
        {
          upsert: true,
          new: true,
        }
      );

    res.json(updated);
  }
);

export const getGameRatings = asyncHandler(
  async (req: any, res: Response) => {
    const appId = Number(req.params.appId);

    const ratings = await Rating.find({ appId });

    const ratingEntries = ratings.filter(
      (item: any) =>
        item.rating !== undefined &&
        item.rating !== null
    );

    const total = ratingEntries.length;

    const avg =
      total > 0
        ? ratingEntries.reduce(
            (sum: number, item: any) =>
              sum + Number(item.rating || 0),
            0
          ) / total
        : 0;

    const recEntries = ratings.filter(
      (item: any) =>
        item.recommended !== undefined &&
        item.recommended !== null
    );

    const positive = recEntries.filter(
      (item: any) =>
        item.recommended === true
    ).length;

    const negative = recEntries.filter(
      (item: any) =>
        item.recommended === false
    ).length;

    const totalVotes =
      positive + negative;

    const recommendPercent =
      totalVotes > 0
        ? Math.round(
            (positive / totalVotes) * 100
          )
        : 50;

    let userRating = null;
    let userRecommended = null;

    if (req.user) {
      const userEntry =
        await Rating.findOne({
          userId: req.user._id,
          appId,
        });

      if (userEntry) {
        userRating =
          userEntry.rating ?? null;

        userRecommended =
          userEntry.recommended ?? null;
      }
    }

    res.json({
      avgRating: Number(avg.toFixed(1)),
      total,
      positive,
      negative,
      recommendPercent,
      userRating,
      userRecommended,
    });
  }
);

export const clearRating = asyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user._id;
    const { appId } = req.body;

    if (!userId) {
      throw new AppError(
        "Unauthorized",
        401
      );
    }

    await Rating.findOneAndDelete({
      userId,
      appId: Number(appId),
    });

    res.json({
      success: true,
    });
  }
);