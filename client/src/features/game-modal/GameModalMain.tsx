import {
  FaSteam,
  FaTwitch,
  FaWindows,
  FaLinux,
  FaApple,
} from "react-icons/fa";

import GameModalStats from "./GameModalStats";
import GameModalReview from "./GameModalReview";

const GameModalMain = ({
  onClose,
  game,
  isLoading,
  error,
  allGamesData,
  activeGameId,
  setActiveGameId,
  developers,
  publishers,
  genres,
  history,
  twitchUrl,
  isTruncated,
  truncate,
  handleTooltipMove,
  statsData,
  rating,
  recommended,
  isFavorited,
  handleFavorite,
  handleRating,
  handleRecommend,
}: any) => {
  return (
    <div className="modal-overlay">
      <div className="panel game-modal-shell">
        <div className="modal-topbar">
          <button
            className="modal-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="game-modal-layout">
          <aside className="game-sidebar">
            <div className="section-header">
              Games
            </div>

            {allGamesData?.data?.map(
              (item: any) => (
                <button
                  key={item.appId}
                  onClick={() =>
                    setActiveGameId(
                      item.appId
                    )
                  }
                  title={item.name}
                  className={`game-list-item ${
                    activeGameId ===
                    item.appId
                      ? "active-item glow"
                      : "hover-retro"
                  }`}
                >
                  <div>
                    {item.name}
                  </div>

                  <div className="game-publisher">
                    CCU:{" "}
                    {item.ccu?.toLocaleString()}
                  </div>
                </button>
              )
            )}
          </aside>

          <main className="game-main crt">
            {isLoading && (
              <div>Loading...</div>
            )}

            {error && (
              <div>
                Error loading game
              </div>
            )}

            {game && (
              <>
                <section className="game-top">
                  <img
                    src={game.image}
                    alt={game.name}
                    className="game-img"
                  />

                  <div className="game-content">
                    <div className="game-header">
                      <h2 className="game-name">
                        {game.name}
                      </h2>

                      <div className="price">
                        {game.price}
                      </div>
                    </div>

                    <div className="game-grid">
                      {/* DEVELOPERS */}
                      <div className="cell">
                        <span className="label">
                          DEVELOPERS
                        </span>

                        <span
                          className={`value ${
                            isTruncated(
                              developers,
                              22
                            )
                              ? "tooltip"
                              : ""
                          }`}
                          data-tooltip={
                            isTruncated(
                              developers,
                              22
                            )
                              ? developers
                              : undefined
                          }
                          onMouseMove={
                            isTruncated(
                              developers,
                              22
                            )
                              ? handleTooltipMove
                              : undefined
                          }
                        >
                          {truncate(
                            developers,
                            22
                          )}
                        </span>
                      </div>

                      {/* PUBLISHER */}
                      <div className="cell">
                        <span className="label">
                          PUBLISHER
                        </span>

                        <span
                          className={`value ${
                            isTruncated(
                              publishers,
                              22
                            )
                              ? "tooltip"
                              : ""
                          }`}
                          data-tooltip={
                            isTruncated(
                              publishers,
                              22
                            )
                              ? publishers
                              : undefined
                          }
                          onMouseMove={
                            isTruncated(
                              publishers,
                              22
                            )
                              ? handleTooltipMove
                              : undefined
                          }
                        >
                          {truncate(
                            publishers,
                            22
                          )}
                        </span>
                      </div>

                      {/* PLATFORMS */}
                      <div className="cell">
                        <span className="label">
                          SUPPORTED
                          PLATFORMS
                        </span>

                        <div className="icon-row">
                          <FaWindows />
                          <FaLinux />
                          <FaApple />
                        </div>
                      </div>

                      {/* RELEASE */}
                      <div className="cell">
                        <span className="label">
                          RELEASE DATE
                        </span>

                        <span className="value">
                          {
                            game.releaseDate
                          }
                        </span>
                      </div>

                      {/* GENRE */}
                      <div className="cell">
                        <span className="label">
                          GENRE
                          </span>
                          
                          <span
                          className={`value ${
                            genres !== "N/A" &&
                            isTruncated(
                              genres,
                              26
                            )
                            ? "tooltip"
                            : ""
                            }`}
                            data-tooltip={
                              genres !== "N/A" &&
                              isTruncated(
                                genres,
                                26
                              )
                              ? genres
                              : undefined
                            }
                            onMouseMove={
                              genres !== "N/A" &&
                              isTruncated(
                                genres,
                                26
                              )
                              ? handleTooltipMove
                              : undefined
                            }
                            >
                              {genres === "N/A"
                              ? "N/A"
                              : truncate(
                                genres,
                                26
                                )}
                          </span>
                      </div>

                      {/* LINKS */}
                      <div className="external-actions">
                        <a
                          href={
                            game.steamLink
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="action-link-btn"
                        >
                          <FaSteam />
                          <span>
                            Store
                          </span>
                        </a>

                        <a
                          href={
                            twitchUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="action-link-btn"
                        >
                          <FaTwitch />
                          <span>
                            Stream
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="game-body">
                  <GameModalStats
                    history={history}
                    statsData={
                      statsData
                    }
                  />

                  <GameModalReview
                    game={game}
                    rating={rating}
                    recommended={
                      recommended
                    }
                    isFavorited={
                      isFavorited
                    }
                    handleFavorite={
                      handleFavorite
                    }
                    handleRating={
                      handleRating
                    }
                    handleRecommend={
                      handleRecommend
                    }
                  />
                </section>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default GameModalMain;