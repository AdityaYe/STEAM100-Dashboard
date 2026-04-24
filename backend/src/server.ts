import app from "./app";
import { connectDB } from "./config/db";
import { startSteamTrackerJob } from "./jobs/steamTracker.job";
import { saveTodayHistory } from "./services/history.service";
import { GameHistory } from "./models/GameHistory.models";
import { logger } from "./utils/logger";

const PORT =
  process.env.PORT || 5000;

const runStartupCheck =
  async () => {
    try {
      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0
      );

      const exists =
        await GameHistory.exists({
          date: today,
        });

      if (!exists) {
        logger.info(
          "No data for today → inserting..."
        );

        await saveTodayHistory();
      } else {
        logger.info(
          "Today's data already exists"
        );
      }
    } catch (error) {
      logger.error(
        "Startup check failed:",
        error
      );
    }
  };

const startServer =
  async () => {
    try {
      await connectDB();

      app.listen(
        PORT,
        () => {
          logger.info(
            `Server running on http://localhost:${PORT}`
          );
        }
      );

      startSteamTrackerJob();

      await runStartupCheck();
    } catch (error) {
      logger.error(
        "Failed to start server:",
        error
      );

      process.exit(1);
    }
  };

startServer();