import api from "./axios";

import type {
  GameResponse,
  GameDetails,
} from "../types/api";

export interface GameHistoryItem {
  date: string;
  ccu: number;
  avgPlaytime: number;
  medianPlaytime: number;
}

export const getGames = async (
  page: number,
  search: string,
  sortBy: string,
  order: string,
  genres: string[]
): Promise<GameResponse> => {
  const params: Record<
    string,
    string | number | boolean
  > = {
    page,
    sortBy,
    order,
  };

  if (search) {
    params.search = search;
  }

  if (genres.length > 0) {
    params.genres =
      genres.join(",");
  }

  const res = await api.get(
    "/api/games",
    { params }
  );

  return res.data;
};

export const getAllGames =
  async (): Promise<GameResponse> => {
    const res = await api.get(
      "/api/games",
      {
        params: {
          all: true,
        },
      }
    );

    return res.data;
  };

export const getGameDetails =
  async (
    id: number
  ): Promise<GameDetails> => {
    const res = await api.get(
      `/api/game/${id}`
    );

    return res.data;
  };

export const getGameHistory =
  async (
    id: number
  ): Promise<GameHistoryItem[]> => {
    const res = await api.get(
      `/api/game/${id}/history`
    );

    return res.data;
  };