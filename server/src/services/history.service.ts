import { fetchSteamGames } from "./games.service";
import { GameHistory } from "../models/GameHistory.models";
import { logger } from "../utils/logger";

export const saveTodayHistory =
  async (): Promise<void> => {
    const games =
      await fetchSteamGames();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const operations = games.map(
      (game) => ({
        updateOne: {
          filter: {
            appId: game.appId,
            date: today,
          },
          update: {
            $set: {
              ccu: game.ccu,
              avgPlaytime:
                game.avgPlaytime,
              medianPlaytime:
                game.medianPlaytime,
            },
          },
          upsert: true,
        },
      })
    );

    await GameHistory.bulkWrite(
      operations
    );

    const cutoff = new Date();

    cutoff.setDate(
      cutoff.getDate() - 14
    );

    cutoff.setHours(0, 0, 0, 0);

    await GameHistory.deleteMany({
      date: { $lt: cutoff },
    });

    logger.info(
      "History updated successfully"
    );
  };