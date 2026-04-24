import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IFavorite
  extends Document {
  userId: mongoose.Types.ObjectId;
  appId: number;
}

const favoriteSchema =
  new Schema<IFavorite>(
    {
      userId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      appId: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

favoriteSchema.index(
  { userId: 1, appId: 1 },
  { unique: true }
);

export const Favorite =
  mongoose.model<IFavorite>(
    "Favorite",
    favoriteSchema
  );