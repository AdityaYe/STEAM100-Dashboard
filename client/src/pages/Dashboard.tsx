import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";

import {
  useOutletContext,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  getGames,
  getAllGames,
} from "../api/games";

import {
  getFavorites,
} from "../api/favorites";

import GameTable from "../features/games/GameTable";
import GameTableSkeleton from "../features/games/GameTableSkeleton";

import type {
  GameResponse,
} from "../types/api";

import { useGameStore } from "../store/useGameStore";
import { useDebounce } from "../hooks/useDebounce";
import { useAuth } from "../features/auth/AuthContext";

import type {
  SortKey,
} from "../features/games/GameTable";

const GameModal = lazy(
  () =>
    import(
      "../features/game-modal/GameModal"
    )
);

type SortOrder =
  | "asc"
  | "desc";

type LayoutContext = {
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  search: string;
};

const VALID_SORT_KEYS: SortKey[] =
  [
    "ccu",
    "avgPlaytime",
    "medianPlaytime",
    "engagement",
  ];

const isValidSortKey = (
  value: string | null
): value is SortKey =>
  value !== null &&
  VALID_SORT_KEYS.includes(
    value as SortKey
  );

const Dashboard = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    selectedGenres,
    setSelectedGenres,
    search,
  } =
    useOutletContext<LayoutContext>();

  const { user } =
    useAuth();

  const favorites =
    useGameStore(
      (state) =>
        state.favorites
    );

  const toggleFavorite =
    useGameStore(
      (state) =>
        state.toggleFavorite
    );

  const prevGenresRef =
    useRef<string[]>([]);

  const authKey =
    user?._id ??
    "guest";

  const isFavoritesMode =
    location.pathname ===
    "/favorites";

  const initialSort =
    searchParams.get(
      "sortBy"
    );

  const [page, setPage] =
    useState<number>(
      Number(
        searchParams.get(
          "page"
        )
      ) || 1
    );

  const [sortBy, setSortBy] =
    useState<SortKey>(
      isValidSortKey(
        initialSort
      )
        ? initialSort
        : "ccu"
    );

  const [order, setOrder] =
    useState<SortOrder>(
      searchParams.get(
        "order"
      ) === "asc"
        ? "asc"
        : "desc"
    );

  const [
    selectedGame,
    setSelectedGame,
  ] = useState<
    number | null
  >(null);

  const debouncedSearch =
    useDebounce(
      search,
      300
    );

  /* ---------------------------------- */
  /* favorites sync                     */
  /* ---------------------------------- */

  const {
    data: serverFavorites,
  } = useQuery<number[]>({
    queryKey: [
      "favorites",
      authKey,
    ],
    queryFn:
      getFavorites,
    enabled:
      !!user,
  });

  useEffect(() => {
    if (
      serverFavorites
    ) {
      useGameStore.setState(
        {
          favorites:
            serverFavorites,
        }
      );
    }
  }, [
    serverFavorites,
  ]);

  /* ---------------------------------- */
  /* games query                        */
  /* ---------------------------------- */

  const {
    data,
    isLoading,
    isFetching,
    error,
  } =
    useQuery<GameResponse>({
      queryKey: [
        "games",
        page,
        debouncedSearch,
        sortBy,
        order,
        selectedGenres,
      ],
      queryFn: () =>
        getGames(
          page,
          debouncedSearch,
          sortBy,
          order,
          selectedGenres
        ),
      staleTime:
        1000 *
        60 *
        5,
      refetchOnWindowFocus:
        false,
      placeholderData:
        (
          previous
        ) =>
          previous,
    });

  const {
    data: allGamesData,
  } =
    useQuery<GameResponse>({
      queryKey: [
        "allGames",
      ],
      queryFn:
        getAllGames,
    });

  /* ---------------------------------- */
  /* url sync                           */
  /* ---------------------------------- */

  useEffect(() => {
    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(page)
    );

    params.set(
      "sortBy",
      sortBy
    );

    params.set(
      "order",
      order
    );

    if (
      debouncedSearch
    ) {
      params.set(
        "search",
        debouncedSearch
      );
    }

    if (
      selectedGenres.length >
      0
    ) {
      params.set(
        "genres",
        selectedGenres.join(
          ","
        )
      );
    }

    setSearchParams(
      params
    );
  }, [
    page,
    sortBy,
    order,
    debouncedSearch,
    selectedGenres,
    setSearchParams,
  ]);

  /* ---------------------------------- */
  /* reset page                         */
  /* ---------------------------------- */

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    selectedGenres,
    location.pathname,
  ]);

  /* ---------------------------------- */
  /* genres sync                        */
  /* ---------------------------------- */

  useEffect(() => {
    const urlGenres =
      searchParams.get(
        "genres"
      );

    const parsed =
      urlGenres
        ? urlGenres.split(
            ","
          )
        : [];

    setSelectedGenres(
      parsed
    );
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(
        prevGenresRef.current
      ) !==
      JSON.stringify(
        selectedGenres
      )
    ) {
      setPage(1);

      prevGenresRef.current =
        selectedGenres;
    }
  }, [
    selectedGenres,
  ]);

  /* ---------------------------------- */
  /* derived values                     */
  /* ---------------------------------- */

  const games =
    data?.data ?? [];

  const displayedGames =
    useMemo(() => {
      if (
        !isFavoritesMode
      ) {
        return games;
      }

      const list =
        allGamesData?.data.filter(
          (
            game
          ) =>
            favorites.includes(
              game.appId
            )
        ) ?? [];

      return [
        ...list,
      ].sort(
        (
          a,
          b
        ) => {
          let aVal = 0;
          let bVal = 0;

          switch (
            sortBy
          ) {
            case "ccu":
              aVal =
                a.ccu;
              bVal =
                b.ccu;
              break;

            case "avgPlaytime":
              aVal =
                a.avgPlaytime;
              bVal =
                b.avgPlaytime;
              break;

            case "medianPlaytime":
              aVal =
                a.medianPlaytime;
              bVal =
                b.medianPlaytime;
              break;

            case "engagement":
              aVal =
                a.avgPlaytime >
                0
                  ? a.medianPlaytime /
                    a.avgPlaytime
                  : 0;

              bVal =
                b.avgPlaytime >
                0
                  ? b.medianPlaytime /
                    b.avgPlaytime
                  : 0;
              break;
          }

          return order ===
            "desc"
            ? bVal - aVal
            : aVal - bVal;
        }
      );
    }, [
      isFavoritesMode,
      games,
      allGamesData,
      favorites,
      sortBy,
      order,
    ]);

  const totalPages =
    isFavoritesMode
      ? 1
      : Math.ceil(
          (data?.total ||
            0) / 10
        );

  /* ---------------------------------- */
  /* handlers                           */
  /* ---------------------------------- */

  const handleSelectGame =
    useCallback(
      (
        id: number
      ) => {
        setSelectedGame(
          id
        );
      },
      []
    );

  const handleCloseModal =
    useCallback(() => {
      setSelectedGame(
        null
      );
    }, []);

  const handlePrevPage =
    useCallback(() => {
      setPage(
        (
          prev
        ) =>
          Math.max(
            prev - 1,
            1
          )
      );
    }, []);

  const handleNextPage =
    useCallback(() => {
      setPage(
        (
          prev
        ) =>
          prev + 1
      );
    }, []);

  const handleSort =
    useCallback(
      (
        field: SortKey
      ) => {
        setPage(1);

        if (
          sortBy ===
          field
        ) {
          setOrder(
            (
              prev
            ) =>
              prev ===
              "desc"
                ? "asc"
                : "desc"
          );
          return;
        }

        setSortBy(
          field
        );

        setOrder(
          "desc"
        );
      },
      [sortBy]
    );

  /* ---------------------------------- */
  /* states                             */
  /* ---------------------------------- */

  if (isLoading) {
    return (
      <div className="dashboard-shell">
        <GameTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell">
        <div className="empty-state">
          Failed to load games
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {isFetching &&
        !isLoading && (
          <div className="status-text">
            <span className="status-dot" />
            Updating...
          </div>
        )}

      {displayedGames.length ===
      0 ? (
        isFavoritesMode ? (
          <div className="favorites-empty-wrap">
            <div className="favorites-empty panel">
              <div className="favorites-empty-icon">
                ♥
              </div>

              <h2 className="favorites-empty-title">
                NO FAVORITES YET
              </h2>

              <p className="favorites-empty-subtitle">
                Save games from the dashboard to build your watchlist.
              </p>

              <button
                className="favorites-empty-btn"
                onClick={() =>
                  navigate("/")
                }
              >
                BROWSE GAMES
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-title">
              No games found
            </p>

            <p className="empty-subtitle">
              Try a different search or clear filters
            </p>
          </div>
        )
      ) : (
        <div className="panel dashboard-panel">
          <GameTable
            games={
              displayedGames
            }
            onSelect={
              handleSelectGame
            }
            favorites={
              favorites
            }
            onToggleFavorite={
              toggleFavorite
            }
            handleSort={
              handleSort
            }
            sortBy={
              sortBy
            }
            order={
              order
            }
            selectedGenres={
              selectedGenres
            }
            setSelectedGenres={
              setSelectedGenres
            }
            page={page}
          />
        </div>
      )}

      {isFavoritesMode && (
        <div>
          <button
            className="btn-outline"
            onClick={() =>
              navigate("/")
            }
          >
            ← DASHBOARD
          </button>
        </div>
      )}

      <div className="pagination-row">
        <button
          className="pager-btn"
          disabled={
            isFavoritesMode ||
            page === 1
          }
          onClick={
            handlePrevPage
          }
        >
          ◀ PREV
        </button>

        <div className="pager-status">
          {isFavoritesMode
            ? "FAV"
            : `${page} / ${totalPages}`}
        </div>

        <button
          className="pager-btn"
          disabled={
            isFavoritesMode ||
            page >=
              totalPages
          }
          onClick={
            handleNextPage
          }
        >
          NEXT ▶
        </button>
      </div>

      {selectedGame && (
        <Suspense fallback={null}>
          <GameModal
            selectedGameId={
              selectedGame
            }
            onClose={
              handleCloseModal
            }
          />
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;
