import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IRating
  extends Document {
  userId: mongoose.Types.ObjectId;
  appId: number;
  rating?: number;
  recommended?: boolean;
}

const ratingSchema =
  new Schema<IRating>(
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

      rating: {
        type: Number,
        min: 1,
        max: 5,
      },

      recommended: {
        type: Boolean,
      },
    },
    {
      timestamps: true,
    }
  );

ratingSchema.index(
  { userId: 1, appId: 1 },
  { unique: true }
);

export const Rating =
  mongoose.model<IRating>(
    "Rating",
    ratingSchema
  );