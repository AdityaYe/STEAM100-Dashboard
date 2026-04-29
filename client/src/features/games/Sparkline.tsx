import { memo } from "react";

type SparkRow = {
  date: string;
  avgPlaytime: number;
  medianPlaytime: number;
};

interface Props {
  data: SparkRow[];
}

const Sparkline = ({
  data,
}: Props) => {
  const values = data.map(
    (item) =>
      item.avgPlaytime > 0
        ? item.medianPlaytime /
          item.avgPlaytime
        : 0
  );

  const max = Math.max(...values);
  const min = Math.min(...values);

  const transformed =
    data.map(
      (item, index) => {
        const value =
          values[index];

        return {
          ...item,
          engagement:
            max !== min
              ? (value - min) /
                (max - min)
              : 0,
        };
      }
    );

  const chartData =
    transformed.length > 1 &&
    max !== min
      ? transformed
      : [
          { engagement: 0.35 },
          { engagement: 0.68 },
          { engagement: 0.48 },
          { engagement: 0.78 },
        ];

  const points =
    chartData
      .map(
        (item, index) => {
          const x =
            chartData.length > 1
              ? (index /
                  (chartData.length - 1)) *
                100
              : 50;

          const y =
            90 -
            item.engagement * 80;

          return `${x},${y}`;
        }
      )
      .join(" ");

  return (
    <div className="sparkline-container">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke="var(--sparkline-color)"
          strokeWidth="8"
          strokeOpacity="0.2"
          vectorEffect="non-scaling-stroke"
        />

        <polyline
          points={points}
          fill="none"
          stroke="var(--sparkline-color)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};

export default memo(Sparkline);
