import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";
import styled from "styled-components";
import { COLORS } from "../styles/Colors";
import { AnimeCardTypes } from "./AnimesList";

type ChartAnimeType = {
  year: number;
  animesCount: number;
  titles: string[];
};

const CustomTooltipWrap = styled.div`
  background-color: ${COLORS.white};
  border: 2px solid ${COLORS.red} !important;
  outline: none !important;
  padding: 15px;
  border-radius: 9px;
  max-width: 300px;
  overflow: auto;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 17px;
  margin-bottom: 10px;
`;

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  overflow: auto;
`;

const TooltipDescription = styled.div`
  line-height: 32px;
`;

const formatData = (data: [AnimeCardTypes]) => {
  const formatObj: any = {};

  // setting anime year as key and and pushing their names into animes array.

  for (const anime of data) {
    formatObj[anime.year] = [...(formatObj[anime.year] || []), anime.title];
  }

  const formattedData = [];

  // converting key value to final required format.

  for (const [key, value] of Object.entries(formatObj)) {
    const newValue: any = value;

    formattedData.push({
      year: key || 0,
      animesCount: newValue.length,
      titles: newValue,
    } as ChartAnimeType);
  }

  return formattedData;
};

const AnimesChart = (props: AnimeCardTypes[] | any): JSX.Element => {
  const chartData: any = formatData(props.data);
  const CustomTooltip: React.FC = ({ active, payload, label }: any) => {
    console.log(payload);
    if (active && payload && payload.length) {
      const animesToDisplay: any = chartData.find(
        (anime: ChartAnimeType) => anime.year === label
      )?.titles;

      return (
        <CustomTooltipWrap>
          <Label>{`${label}`}</Label>
          {animesToDisplay.map((title: string) => (
            <TooltipDescription key={Math.random()}>{title}</TooltipDescription>
          ))}
        </CustomTooltipWrap>
      ) as JSX.Element;
    }

    return null;
  };

  return (
    <FlexCenter>
      <AreaChart
        width={window.innerWidth - window.innerWidth * 0.015}
        height={window.innerHeight / 2}
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor= {COLORS.primary} stopOpacity={0.8} />
            <stop offset="95%" stopColor= {COLORS.secondary} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis dataKey="year" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Tooltip
          wrapperStyle={{ border: "none !important", outline: "none" }}
          content={CustomTooltip}
        />
        <Area
          type="monotone"
          dataKey="animesCount"
          stroke= {COLORS.secondary}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </FlexCenter>
  );
};

export default AnimesChart;
