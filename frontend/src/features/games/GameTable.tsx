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
}

const GameTable = ({
  games,
  onSelect,
  favorites,
  onToggleFavorite,
  page,
  handleSort,
  sortBy,
  order,
}: Props) => {
  const getArrow = (
    key: SortKey
  ) => {
    if (sortBy !== key) {
      return "";
    }

    return order === "desc"
      ? "↓"
      : "↑";
  };

  return (
    <div className="panel game-table-shell">
      <div className="game-table-inner">
        <div className="table-head">
          <h2 className="table-title">
            TOP 100 STEAM GAMES
          </h2>

          <p className="table-subtitle">
            LAST 14 DAYS OF ACTIVITY
          </p>
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