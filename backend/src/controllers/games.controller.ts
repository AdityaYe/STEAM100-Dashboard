import { Request, Response } from "express";
import axios from "axios";

import { fetchSteamGames } from "../services/games.service";
import { GameHistory } from "../models/GameHistory.models";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

const PAGE_LIMIT = 10;
const STEAM_TIMEOUT = 5000;

const SORT_FIELDS = [
  "ccu",
  "avgPlaytime",
  "medianPlaytime",
  "engagement",
];

export const getTopGames = asyncHandler(
  async (req: Request, res: Response) => {
    res.set("Cache-Control", "no-store");

    const page = Number(req.query.page) || 1;
    const limit = PAGE_LIMIT;

    const search =
      (req.query.search as string)?.toLowerCase() || "";

    const sortBy =
      (req.query.sortBy as string) || "ccu";

    const genres =
      (req.query.genres as string)?.split(",") || [];

    const order =
      req.query.order === "asc" ? "asc" : "desc";

    const games = await fetchSteamGames();

    let filtered = [...games];

    if (search) {
      filtered = filtered.filter((game: any) =>
        game.name.toLowerCase().includes(search)
      );
    }

    if (genres.length > 0) {
      filtered = filtered.filter((game: any) =>
        game.genres?.some((genre: string) =>
          genres.includes(genre)
        )
      );
    }

    if (SORT_FIELDS.includes(sortBy)) {
      filtered.sort((a: any, b: any) => {
        const getValue = (game: any) => {
          if (sortBy === "engagement") {
            return game.avgPlaytime > 0
              ? game.medianPlaytime / game.avgPlaytime
              : 0;
          }

          return game[sortBy];
        };

        return order === "desc"
          ? getValue(b) - getValue(a)
          : getValue(a) - getValue(b);
      });
    }

    if (String(req.query.all) === "true") {
      return res.json({
        success: true,
        page,
        total: filtered.length,
        data: filtered,
      });
    }

    const start = (page - 1) * limit;

    const paginated = filtered.slice(
      start,
      start + limit
    );

    res.json({
      success: true,
      page,
      total: filtered.length,
      data: paginated,
    });
  }
);

export const getGameDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    try {
      const { data } = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${id}&l=english`,
        {
          timeout: STEAM_TIMEOUT,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            "Accept-Language":
              "en-US,en;q=0.9",
            Accept: "application/json",
          },
        }
      );

      const game = data[id];

      if (!game?.success || !game.data) {
        throw new AppError(
          "Game data not available",
          404
        );
      }

      const g = game.data;

      res.json({
        name: g.name,
        image: g.header_image,
        description: g.short_description,
        developers: g.developers || [],
        publishers: g.publishers || [],
        genres:
          g.genres?.map(
            (item: any) => item.description
          ) || [],
        releaseDate:
          g.release_date?.date || "N/A",

        platforms: {
          windows:
            g.platforms?.windows || false,
          mac: g.platforms?.mac || false,
          linux:
            g.platforms?.linux || false,
        },

        price:
          g.price_overview?.final_formatted ||
          "Free",

        steamLink:
          `https://store.steampowered.com/app/${id}`,

        screenshots:
          g.screenshots?.map(
            (shot: any) => shot.path_full
          ) || [],

        website: g.website || null,
      });
    } catch {
      logger.info("Steam fallback triggered");

      return res.json({
        name: "Game Details Unavailable",
        image: "",
        description: "Steam data not available",
        developers: [],
        publishers: [],
        genres: [],
        releaseDate: "N/A",

        platforms: {
          windows: false,
          mac: false,
          linux: false,
        },

        price: "N/A",

        steamLink:
          `https://store.steampowered.com/app/${id}`,

        screenshots: [],
        website: null,
      });
    }
  }
);

export const getGameHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const history = await GameHistory.find({
      appId: id,
    }).sort({
      date: 1,
    });

    res.json(history);
  }
);