import {
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";

import SingleMetricChart from "../games/SingleMetricChart";

const GameModalStats = ({
  history,
  statsData,
}: any) => {
  const avgRating =
    Number(
      statsData.avgRating ?? 0
    );

  const total =
    Number(
      statsData.total ?? 0
    );

  const positive =
    Number(
      statsData.positive ?? 0
    );

  const negative =
    Number(
      statsData.negative ?? 0
    );

  const totalVotes =
    positive + negative;

  const percent =
    totalVotes > 0
      ? (positive /
          totalVotes) *
        100
      : 50;

  return (
    <div className="game-left">
      <div className="stats-grid">
        <div className="section bordered">
          <div className="section-header">
            Ratings
          </div>

          <div className="ratings-inline">
            <span className="rating-number-inline">
              {avgRating.toFixed(1)}
              <small>/5</small>
            </span>
              
              <div className="stars-row">
              <div className="stars-inline">
                {[1, 2, 3, 4, 5].map((star) => {
                  const full =
                  avgRating >= star;
                  
                  const half =
                  avgRating >= star - 0.5 &&
                  avgRating < star;
                  
                  return (
                  <span key={star}>
                    {full
                    ? "★"
                    : half
                    ? "⯪"
                    : "☆"}
                    </span>
                    );
                })}
              </div>
              
              <span className="rating-count-inline">
                ({total})
              </span>
            </div>
        </div>
      </div>

        <div className="section bordered">
          <div className="section-header">
            Recommendations
          </div>

          <div className="recommend-bar">
            <div
              className="recommend-yes"
              style={{
                width: `${percent}%`,
              }}
            >
              <FaThumbsUp />
              {positive > 0 &&
                ` (${positive})`}
            </div>

            <div
              className="recommend-no"
              style={{
                width: `${
                  100 - percent
                }%`,
              }}
            >
              <FaThumbsDown />
              {negative > 0 &&
                ` (${negative})`}
            </div>
          </div>
        </div>
      </div>

      <div className="panel chart-panel">
        <div className="section-header">
          Chart
        </div>

        <SingleMetricChart
          data={history}
          dataKey="ccu"
          color="#00FFC6"
          title="Concurrent Players"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
          }}
        >
          <SingleMetricChart
            data={history}
            dataKey="avgPlaytime"
            color="#3b82f6"
            title="Average Playtime"
          />

          <SingleMetricChart
            data={history}
            dataKey="medianPlaytime"
            color="#f59e0b"
            title="Median Playtime"
          />
        </div>
      </div>
    </div>
  );
};

export default GameModalStats;