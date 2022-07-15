import makeStyles from "@mui/styles/makeStyles";
import { ParentSize } from "@visx/responsive";
import React, { ReactNode } from "react";
import { useChartScale } from "../../hooks/useChartScale";

const useStyle = makeStyles({
  chartLayout: {
    marginTop: 24,
    marginBottom: 20,
    position: "relative",
  },
  chartLayoutContent: {
    position: "absolute",
  },
});

export interface ChartLayoutProps {
  chartWidth: number;
  chartHeight: number;
  render: (px: number) => ReactNode;
}
export function ChartLayout(props: ChartLayoutProps) {
  const { chartWidth, chartHeight, render } = props;
  const scale = useChartScale();
  const css = useStyle();
  if (scale(1) !== 1) {
    const px = scale(window.innerWidth / chartWidth);
    return (
      // <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div className={css.chartLayout} style={{ height: chartHeight * px, overflowX: "scroll" }}>
        <div className={css.chartLayoutContent}>{render(px)}</div>
      </div>
      // </LayoutBox>
    );
  }
  return (
    // <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
    <div className={css.chartLayout} style={{ paddingBottom: `${(100 * chartHeight) / chartWidth}%` }}>
      <ParentSize>
        {(info) => {
          const px = info.width / chartWidth;
          return !px ? null : <div className={css.chartLayoutContent}>{render(px)}</div>;
        }}
      </ParentSize>
    </div>
    // </LayoutBox>
  );
}
