import axios from "axios";
import pLimit from "p-limit";
import { logger } from "../utils/logger";

export interface Game {
  rank: number;
  appId: number;
  name: string;
  publisher: string;
  avgPlaytime: number;
  medianPlaytime: number;
  ccu: number;
  genres: string[];
}

const limit = pLimit(5);

const CACHE_TIME =
  5 * 60 * 1000;

const STEAM_TIMEOUT = 5000;

let cache: Game[] | null = null;
let lastFetch = 0;

export const fetchSteamGames =
  async (): Promise<Game[]> => {
    const now = Date.now();

    if (
      cache &&
      now - lastFetch < CACHE_TIME
    ) {
      logger.info(
        "Serving from cache"
      );

      return cache;
    }

    logger.info(
      "Fetching from SteamSpy API"
    );

    try {
      const { data } =
        await axios.get(
          "https://steamspy.com/api.php?request=top100in2weeks"
        );

      const gamesArray =
        Object.values(data);

      const formatted: Game[] =
        await Promise.all(
          gamesArray.map(
            (
              game: any,
              index: number
            ) =>
              limit(
                async () => {
                  const genres =
                    await fetchGameGenres(
                      game.appid
                    );

                  return {
                    rank:
                      index + 1,
                    appId:
                      game.appid,
                    name:
                      game.name,
                    publisher:
                      game.publisher ||
                      "Unknown",
                    avgPlaytime:
                      game.average_2weeks ||
                      0,
                    medianPlaytime:
                      game.median_2weeks ||
                      0,
                    ccu:
                      game.ccu || 0,
                    genres,
                  };
                }
              )
          )
        );

      cache = formatted;
      lastFetch = now;

      return formatted;
    } catch (error) {
      logger.error(
        "SteamSpy error:",
        error
      );

      throw new Error(
        "Failed to fetch Steam games"
      );
    }
  };

const fetchGameGenres =
  async (
    appId: number
  ): Promise<string[]> => {
    try {
      const { data } =
        await axios.get(
          `https://store.steampowered.com/api/appdetails?appids=${appId}`,
          {
            timeout:
              STEAM_TIMEOUT,

            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",

              "Accept-Language":
                "en-US,en;q=0.9",

              Accept:
                "application/json",
            },
          }
        );

      const game =
        data[appId];

      if (!game?.success) {
        return [];
      }

      return (
        game.data.genres?.map(
          (item: any) =>
            item.description
        ) || []
      );
    } catch {
      return [];
    }
  };