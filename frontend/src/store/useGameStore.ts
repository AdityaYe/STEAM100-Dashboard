import { create } from "zustand";

interface GameState {
  favorites: number[];

  setFavorites: (
    ids: number[]
  ) => void;

  toggleFavorite: (
    id: number
  ) => void;
}

const STORAGE_KEY =
  "favorites";

const saveFavorites = (
  ids: number[]
) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ids)
  );
};

export const useGameStore =
  create<GameState>(
    (set, get) => ({
      favorites: [],

      setFavorites: (
        ids
      ) => {
        saveFavorites(
          ids
        );

        set({
          favorites:
            ids,
        });
      },

      toggleFavorite: (
        id
      ) => {
        const current =
          get()
            .favorites;

        const updated =
          current.includes(
            id
          )
            ? current.filter(
                (
                  item
                ) =>
                  item !==
                  id
              )
            : [
                ...current,
                id,
              ];

        saveFavorites(
          updated
        );

        set({
          favorites:
            updated,
        });
      },
    })
  );