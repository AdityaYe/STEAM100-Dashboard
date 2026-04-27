import {
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

const stars = [1, 2, 3, 4, 5];

const GameModalReview = ({
  game,
  rating,
  recommended,
  isFavorited,
  handleFavorite,
  handleRating,
  handleRecommend,
}: any) => {
  return (
    <div className="game-right">
      <div className="section bordered description-section">
        <div className="section-header">
          Description
        </div>

        <div className="description-content">
          {game.description}
        </div>
      </div>

      <div className="section bordered">
        <div className="section-header">
          Add To Favorite
        </div>

        <button
          className={`favorite-btn ${
            isFavorited
              ? "active"
              : ""
          }`}
          onClick={handleFavorite}
        >
          {isFavorited
            ? "♥ Favorited"
            : "♡ Favorite"}
        </button>
      </div>

      <div className="section bordered">
        <div className="section-header">
          Review This Game
        </div>

        <div className="review-section-body">
          Rate:

          <div className="review-stars">
            {stars.map((star) => (
              <button
                key={star}
                onClick={() =>
                  handleRating(
                    star
                  )
                }
              >
                {star <= rating
                  ? "★"
                  : "☆"}
              </button>
            ))}
          </div>

          <div className="review-thumbs">
            Recommend:

            <button
              className={`thumb-btn up ${
                recommended === true
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleRecommend(
                  true
                )
              }
            >
              <FaThumbsUp />
            </button>

            <button
              className={`thumb-btn down ${
                recommended === false
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleRecommend(
                  false
                )
              }
            >
              <FaThumbsDown />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModalReview;