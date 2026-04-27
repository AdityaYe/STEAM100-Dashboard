import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IGameHistory
  extends Document {
  appId: number;
  date: Date;
  ccu: number;
  avgPlaytime: number;
  medianPlaytime: number;
}

const gameHistorySchema =
  new Schema<IGameHistory>(
    {
      appId: {
        type: Number,
        required: true,
      },

      date: {
        type: Date,
        required: true,
      },

      ccu: {
        type: Number,
        default: 0,
      },

      avgPlaytime: {
        type: Number,
        default: 0,
      },

      medianPlaytime: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

gameHistorySchema.index(
  { appId: 1, date: 1 },
  { unique: true }
);

export const GameHistory =
  mongoose.model<IGameHistory>(
    "GameHistory",
    gameHistorySchema
  );