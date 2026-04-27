import api from "./axios";

interface RatingPayload {
  appId: number;
  rating?: number;
  recommended?: boolean | null;
}

export const submitRating =
  async (
    data: RatingPayload
  ) => {
    const res = await api.post(
      "/api/ratings",
      data
    );

    return res.data;
  };

export const getRatings =
  async (
    appId: number
  ) => {
    const res = await api.get(
      `/api/ratings/${appId}`
    );

    return res.data;
  };