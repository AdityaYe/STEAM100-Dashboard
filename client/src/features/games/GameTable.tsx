import { useState } from "react";
import { Filter } from "lucide-react";

import GameRow from "./GameRow";
import type { Game } from "../../types/api";

export type SortKey =
  | "ccu"
  | "avgPlaytime"
  | "medianPlaytime"
  | "engagement"
  | "favorites";

type SortOrder =
  | "asc"
  | "desc";

interface Props {
  games: Game[];
  onSelect: (
    appId: number
  ) => void;
  favorites: number[];
  onToggleFavorite: (
    appId: number
  ) => void;
  page: number;
  handleSort: (
    key: SortKey
  ) => void;
  sortBy: SortKey;
  order: SortOrder;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

const GENRES = [
  "Action",
  "Adventure",
  "RPG",
  "Strategy",
  "Simulation",
  "Sports",
  "Indie",
  "Casual",
];

const GameTable = ({
  games,
  onSelect,
  favorites,
  onToggleFavorite,
  page,
  handleSort,
  sortBy,
  order,
  selectedGenres,
  setSelectedGenres,
}: Props) => {
  const [
    genreOpen,
    setGenreOpen,
  ] = useState(false);

  const getArrow = (
    key: SortKey
  ) => {
    if (sortBy !== key) {
      return "";
    }

    return order === "desc"
      ? "▼"
      : "▲";
  };

  const toggleGenre = (
    genre: string
  ) => {
    setSelectedGenres(
      (current) =>
        current.includes(
          genre
        )
          ? current.filter(
              (item) =>
                item !== genre
            )
          : [
              ...current,
              genre,
            ]
    );
  };

  return (
    <div className="panel game-table-shell">
      <div className="game-table-inner">
        <div className="table-head">
          <div className="table-head-copy">
            <h2 className="table-title">
              TOP 100 STEAM GAMES
            </h2>

            <p className="table-subtitle">
              LAST 14 DAYS OF ACTIVITY
            </p>
          </div>

          <div className="mobile-table-tools">
            <button
              type="button"
              className="mobile-genre-trigger"
              onClick={() =>
                setGenreOpen(
                  (open) => !open
                )
              }
              aria-expanded={
                genreOpen
              }
            >
              <Filter size={16} />
              Genre
            </button>

            {genreOpen && (
              <div className="mobile-genre-menu">
                {GENRES.map(
                  (genre) => {
                    const checked =
                      selectedGenres.includes(
                        genre
                      );

                    return (
                      <label
                        key={genre}
                        className="mobile-genre-option"
                      >
                        <span>
                          {genre}
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          onChange={() =>
                            toggleGenre(
                              genre
                            )
                          }
                        />

                        <span
                          className={`switch ${
                            checked
                              ? "switch-on"
                              : ""
                          }`}
                        >
                          <span className="switch-thumb" />
                        </span>
                      </label>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>

        <div className="table-grid table-header-row">
          <div
            className="sortable"
            onClick={() =>
              handleSort(
                "favorites"
              )
            }
          >
            ADD
          </div>

          <div>#</div>

          <div>NAME</div>

          <div>TREND</div>

          <div
            className="sortable"
            onClick={() =>
              handleSort("ccu")
            }
          >
            CONCURRENT
            PLAYERS(CCU){" "}
            {getArrow("ccu")}
          </div>

          <div
            className="sortable"
            onClick={() =>
              handleSort(
                "engagement"
              )
            }
          >
            ENGAGEMENT{" "}
            {getArrow(
              "engagement"
            )}
          </div>
        </div>

        {games.map(
          (
            game,
            index
          ) => (
            <GameRow
              key={
                game.appId
              }
              game={game}
              index={index}
              page={page}
              favorites={
                favorites
              }
              onToggleFavorite={
                onToggleFavorite
              }
              onSelect={
                onSelect
              }
            />
          )
        )}
      </div>
    </div>
  );
};

export default GameTable;
