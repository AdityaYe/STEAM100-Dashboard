import cron from "node-cron";
import { saveTodayHistory } from "../services/history.service";
import { logger } from "../utils/logger";

export const startSteamTrackerJob =
  () => {
    cron.schedule(
      "0 0 * * *",
      async () => {
        logger.info(
          "Running daily Steam tracker job..."
        );

        try {
          await saveTodayHistory();

          logger.info(
            "Daily tracker completed"
          );
        } catch (error) {
          logger.error(
            "Cron job failed:",
            error
          );
        }
      }
    );
  };