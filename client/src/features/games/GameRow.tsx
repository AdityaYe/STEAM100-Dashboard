import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { memo } from "react";

import {
  getGameDetails,
  getGameHistory,
} from "../../api/games";

import {
  toggleFavoriteApi,
} from "../../api/favorites";

import Sparkline from "./Sparkline";
import { useProtectedAction } from "../../hooks/useProtectedAction";
import toast from "react-hot-toast";

import type {
  Game,
  GameHistoryItem,
  GameDetails,
} from "../../types/api";

const getImage = (
  appId: number
) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

const formatNumber = (
  num: number
) =>
  num
    ? num.toLocaleString()
    : "-";

interface Props {
  game: Game;
  index: number;
  page: number;
  favorites: number[];
  onToggleFavorite: (
    appId: number
  ) => void;
  onSelect: (
    appId: number
  ) => void;
}

const GameRow = ({
  game,
  index,
  page,
  favorites,
  onToggleFavorite,
  onSelect,
}: Props) => {
  const queryClient =
    useQueryClient();

  const {
    data: history,
  } = useQuery<
    GameHistoryItem[]
  >({
    queryKey: [
      "history",
      game.appId,
    ],
    queryFn: () =>
      getGameHistory(
        game.appId
      ),
    staleTime:
      1000 *
      60 *
      10,
  });

  const isFavorite =
    favorites.includes(
      game.appId
    );

  const engagement =
    game.avgPlaytime > 0
      ? (
          game.medianPlaytime /
          game.avgPlaytime
        ).toFixed(2)
      : "-";

  const rank =
    (page - 1) * 10 +
    index +
    1;

  const {runProtected} = useProtectedAction();

  const handleFavorite = (
  appId: number
) => {
  runProtected(
    async () => {
      await toggleFavoriteApi({
        appId,
      });

      onToggleFavorite(appId);

      toast.success(
        favorites.includes(appId)
          ? "Removed from favorites"
          : "Added to favorites"
      );
    }
  );
};

  const prefetchGameData =
    () => {
      queryClient.prefetchQuery<
        GameHistoryItem[]
      >({
        queryKey: [
          "history",
          game.appId,
        ],
        queryFn: () =>
          getGameHistory(
            game.appId
          ),
        staleTime:
          1000 *
          60 *
          10,
      });

      queryClient.prefetchQuery<
        GameDetails
      >({
        queryKey: [
          "game",
          game.appId,
        ],
        queryFn: () =>
          getGameDetails(
            game.appId
          ),
        staleTime:
          1000 *
          60 *
          10,
      });
    };

  return (
      <div
        onClick={() =>
          onSelect(
            game.appId
          )
        }
        onMouseEnter={
          prefetchGameData
        }
        className={`game-row hover-retro ${
          isFavorite
            ? "is-favorite"
            : ""
        }`}
      >
        <div
          className="game-fav"
          onClick={(e) => {
            e.stopPropagation();

            handleFavorite(
              game.appId
            );
          }}
        >
          {isFavorite
            ? "♥" 
            : "♡"}
        </div>

        <div className="game-mobile-title">
          <div className="game-rank">
            {rank}
          </div>

          <div className="game-info">
            <img
              src={getImage(
                game.appId
              )}
              alt={game.name}
              className="game-thumb"
              loading="lazy"
            />

            <div className="game-meta">
              <div className="game-name">
                {game.name}
              </div>

              <div className="game-publisher">
                {game.publisher ||
                  "Unknown"}
              </div>
            </div>
          </div>
        </div>

        <div className="game-trend">
          {Array.isArray(
            history
          ) ? (
            <Sparkline
              data={history}
            />
          ) : (
            "..."
          )}
        </div>

        <div className="game-mobile-stats">
          <div className="game-ccu">
            {formatNumber(
              game.ccu
            )}
          </div>

          <div className="game-eng">
            {engagement}
          </div>
        </div>
      </div>
  );
};

export default memo(GameRow);
