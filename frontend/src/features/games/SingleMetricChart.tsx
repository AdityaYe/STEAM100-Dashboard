import { memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartMetricKey =
  | "ccu"
  | "avgPlaytime"
  | "medianPlaytime";

interface ChartRow {
  date: string;
  ccu: number;
  avgPlaytime: number;
  medianPlaytime: number;
}

type Props = {
  data: ChartRow[];
  dataKey: ChartMetricKey;
  color: string;
  title: string;
};

const chartMargin = {
  top: 10,
  right: 10,
  left: -10,
  bottom: 10,
};

const axisTick = {
  fill: "var(--text-secondary)",
  fontSize: 10,
};

const tooltipStyle = {
  background: "var(--panel)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
};

const SingleMetricChart =({
  data,
  dataKey,
  color,
  title,
}: Props) => {
  return (
    <div className="p-4 rounded-xl chart-container">
      <div className="w-full h-full">
        <ResponsiveContainer
          width="100%"
          height={110}
        >
          <LineChart
            data={data}
            margin={chartMargin}
          >
            <XAxis
              dataKey="date"
              hide
            />

            <YAxis
              stroke="var(--text-secondary)"
              tick={axisTick}
            />

            <Tooltip
              contentStyle={
                tooltipStyle
              }
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="chart-label">
          {title.toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default memo(SingleMetricChart);