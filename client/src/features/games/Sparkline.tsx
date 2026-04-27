import { memo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

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

  if (
    typeof window !== "undefined" &&
    window.innerWidth <= 1100
  ) {
    return null;
  }

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

  return (
    <div className="sparkline-container">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={transformed}
        >
          <Line
            type="linear"
            dataKey="engagement"
            stroke="var(--sparkline-color)"
            strokeWidth={5}
            dot={false}
            strokeOpacity={0.15}
            isAnimationActive={false}
          />

          <Line
            type="linear"
            dataKey="engagement"
            stroke="var(--sparkline-color)"
            strokeWidth={2}
            dot={false}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(Sparkline);