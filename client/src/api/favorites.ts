import api from "./axios";

export const toggleFavoriteApi =
  async (data: {
    appId: number;
  }) => {
    const res = await api.post(
      "/api/favorites",
      data
    );

    return res.data;
  };

export const getFavorites =
  async (): Promise<number[]> => {
    const res = await api.get(
      "/api/favorites"
    );

    return res.data;
  };