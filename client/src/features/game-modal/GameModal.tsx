import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQuery } from "@tanstack/react-query";

import {
  getAllGames,
  getGameDetails,
  getGameHistory,
} from "../../api/games";

import {
  getRatings,
  submitRating,
} from "../../api/ratings";

import {
  toggleFavoriteApi,
} from "../../api/favorites";

import { useGameStore } from "../../store/useGameStore";
import { useProtectedAction } from "../../hooks/useProtectedAction";

import GameModalMain from "./GameModalMain";

import type {
  GameDetails,
  GameHistoryItem,
  GameResponse,
} from "../../types/api";

interface RatingsData {
  averageRating?: number;
  totalRatings?: number;
  recommendPercent?: number;
  totalRecommendations?: number;
  userRating?: number;
  userRecommended?: boolean | null;
}

interface Props {
  selectedGameId: number;
  onClose: () => void;
}

const GameModal = ({
  selectedGameId,
  onClose,
}: Props) => {
  const [
    activeGameId,
    setActiveGameId,
  ] = useState(
    selectedGameId
  );

  const [rating, setRating] =
    useState(0);

  const [
    recommended,
    setRecommended,
  ] = useState<
    boolean | null
  >(null);

  const [
    isRatingSubmitting,
    setIsRatingSubmitting,
  ] = useState(false);

  const {
    favorites,
    toggleFavorite,
  } = useGameStore();

  const {
    user,
    runProtected,
  } =
    useProtectedAction();

  /* ---------------------------------- */
  /* sync selected game                 */
  /* ---------------------------------- */

  useEffect(() => {
    setActiveGameId(
      selectedGameId
    );
  }, [
    selectedGameId,
  ]);

  /* ---------------------------------- */
  /* queries                            */
  /* ---------------------------------- */

  const {
    data: allGamesData,
  } = useQuery<GameResponse>({
    queryKey: [
      "allGames",
    ],
    queryFn:
      getAllGames,
  });

  const {
    data: game,
    isLoading,
    error,
  } =
    useQuery<GameDetails>({
      queryKey: [
        "game",
        activeGameId,
      ],
      queryFn: () =>
        getGameDetails(
          activeGameId
        ),
      enabled:
        !!activeGameId,
    });

  const {
    data: history = [],
  } = useQuery<
    GameHistoryItem[]
  >({
    queryKey: [
      "history",
      activeGameId,
    ],
    queryFn: () =>
      getGameHistory(
        activeGameId
      ),
    enabled:
      !!activeGameId,
  });

  const {
    data: stats,
    refetch: refetchRatings,
  } =
    useQuery<RatingsData>({
      queryKey: [
        "ratings",
        activeGameId,
        user?._id
          ? "auth"
          : "guest",
      ],
      queryFn: () =>
        getRatings(
          activeGameId
        ),
      enabled:
        !!activeGameId,
      staleTime: 0,
      refetchOnWindowFocus:
        false,
    });

  /* ---------------------------------- */
  /* sync rating state                  */
  /* ---------------------------------- */

  useEffect(() => {
  if (!stats) {
    setRating(0);
    setRecommended(null);
    return;
  }

  setRating(
    Number(
      stats.userRating ?? 0
    )
  );

  setRecommended(
    stats.userRecommended ??
      null
  );
}, [stats, activeGameId]);

  /* ---------------------------------- */
  /* derived values                     */
  /* ---------------------------------- */

  const isFavorited =
    favorites.includes(
      activeGameId
    );

  const developers =
    useMemo(() => {
      if (
        !game?.developers
          ?.length
      ) {
        return "N/A";
      }

      return game.developers.join(
        ", "
      );
    }, [game]);

  const publishers =
    useMemo(() => {
      if (
        !game?.publishers
          ?.length
      ) {
        return "N/A";
      }

      return game.publishers.join(
        ", "
      );
    }, [game]);

 const genres = useMemo(() => {
  if (
    !game?.genres ||
    !Array.isArray(
      game.genres
    ) ||
    game.genres.length === 0
  ) {
    return "N/A";
  }

  return game.genres
    .map((g: any) =>
      typeof g ===
      "string"
        ? g
        : g?.description ||
          g?.name ||
          ""
    )
    .filter(Boolean)
    .join(", ");
}, [game]);

  const statsData =
  (stats as any)?.data ||
  stats ||
  {};

  /* ---------------------------------- */
  /* helpers                            */
  /* ---------------------------------- */

    const isTruncated = (
  text: string,
  limit: number
) =>
  !!text &&
  text.length > limit;

const getTwitchCategory = (
  gameName: string
) => {
  const lower =
    gameName.toLowerCase();

 const specialCases: Record<
  string,
  string
> = {
  "counter-strike 2":
    "counter-strike",

  cs2:
    "counter-strike",
};

  if (specialCases[lower]) {
    return specialCases[lower];
  }

  return lower
    .replace(/:/g, "")
    .replace(/'/g, "")
    .replace(/\s+/g, "-");
};

const twitchUrl =
  game?.name
    ? `https://www.twitch.tv/directory/category/${getTwitchCategory(game.name)}`
    : "#";

const handleTooltipMove = (
  e: React.MouseEvent<HTMLElement>
) => {
  const rect =
    e.currentTarget.getBoundingClientRect();

  e.currentTarget.style.setProperty(
    "--tooltip-x",
    `${rect.left + rect.width / 2}px`
  );

  e.currentTarget.style.setProperty(
    "--tooltip-y",
    `${rect.top - 14}px`
  );
};

const truncate = (
  text: string,
  max: number
) =>
  text.length > max
    ? `${text.slice(0, max)}...`
    : text;

  /* ---------------------------------- */
  /* actions                            */
  /* ---------------------------------- */

  const handleFavorite =
    async () => {
      await toggleFavoriteApi(
        {
          appId:
            activeGameId,
        }
      );

      toggleFavorite(
        activeGameId
      );
    };

  const handleRating =
  async (
    star: number
  ) => {
    if (
      isRatingSubmitting
    ) {
      return;
    }

    try {
      setIsRatingSubmitting(
        true
      );

      const next =
        rating === star
          ? 0
          : star;

      setRating(next);

      await submitRating({
        appId: activeGameId,
        rating: next,
        recommended,
      });

      await refetchRatings();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(
        () => {
          setIsRatingSubmitting(
            false
          );
        },
        250
      );
    }
  };

  const handleRecommend =
  async (
    value: boolean
  ) => {
    if (
      isRatingSubmitting
    ) {
      return;
    }

    try {
      setIsRatingSubmitting(
        true
      );

      const next =
        recommended ===
        value
          ? null
          : value;

      setRecommended(
        next
      );

      await submitRating({
        appId: activeGameId,
        recommended: next,
        rating,
      });
      
      refetchRatings();

      await refetchRatings();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(
        () =>
          setIsRatingSubmitting(
            false
          ),
        400
      );
    }
  };

  if (!activeGameId) {
    return null;
  }

  return (
    <GameModalMain
      onClose={onClose}
      game={game}
      error={error}
      isLoading={
        isLoading
      }
      allGamesData={
        allGamesData
      }
      activeGameId={
        activeGameId
      }
      setActiveGameId={
        setActiveGameId
      }
      developers={
        developers
      }
      publishers={
        publishers
      }
      genres={
        genres
      }
      history={
        history
      }
      twitchUrl={
        twitchUrl
      }
      isTruncated={
        isTruncated
      }
      truncate={
        truncate
      }
      handleTooltipMove={
        handleTooltipMove
      }
      statsData={
        statsData
      }
      rating={rating}
      recommended={
        recommended
      }
      isFavorited={
        isFavorited
      }
      handleFavorite={() =>
        runProtected(
          handleFavorite
        )
      }
      
      handleRating={(
        star: number
      ) =>
        runProtected(() =>
          handleRating(star)
        )
      }
      
      handleRecommend={(
        value: boolean
      ) =>
        runProtected(() =>
          handleRecommend(value)
        )
      }
    />
  );
};

export default GameModal;