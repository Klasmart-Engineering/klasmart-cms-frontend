import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { BarGroup } from "@visx/shape";
import React from "react";
import ReportTooltip from "../../../components/ReportTooltip";
import { d } from "../../../locale/LocaleManager";

export type BarGroupProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data: {
    time: string;
    v1: number | number[];
    v2: number;
    v3: number;
    [key: string]: any;
  }[];
  label: { v1: string | string[]; v2: string; v3: string };
  itemUnit?: string;
  durationTime?: number;
};

const useStyle = makeStyles((theme) =>
  createStyles({
    container: {
      position: "relative",
    },
    background: {
      position: "absolute",
      height: "calc(100% - 45px)",
      width: "100%",
      top: 0,
      display: "flex",
      alignItems: "center",
      borderTop: "1px dashed #db9292",
      zIndex: 0,
    },
    standard: {
      position: "absolute",
      top: 0,
      color: "#666",
      left: "10px",
      zIndex: 2,
    },
    standard50: {
      color: "#666",
      position: "absolute",
      top: "calc(50% - 20px)",
      left: "10px",
      zIndex: 2,
    },
    line: {
      width: "100%",
      position: "relative",
      borderTop: "1px dashed #db9292",
      pointerEvents: "none",
      paddingLeft: "10px",
    },
    svg: {
      position: "relative",
      zIndex: 2,
    },
  })
);

const defaultMargin = { top: 0, right: 0, bottom: 40, left: 0 };
const handleV1 = (n: number | number[]) => (Array.isArray(n) ? n.reduce((v, c) => v + c) : n);
function Chart({ width, height, margin = defaultMargin, ...props }: BarGroupProps) {
  const style = useStyle();
  const keys = ["v1", "v2", "v3"];
  const tempScale = scaleLinear<number>({
    domain: [0, props.itemUnit === "%" ? 100 : Math.max(...props.data.map((d) => Math.max(handleV1(d.v1), d.v2, d.v3)))],
  });
  const colorScale = scaleOrdinal<string, string>({
    domain: keys,
    range: ["#0E78D5", "#BED6EB", "#A8C0EF"],
  });

  const getDate = (data: BarGroupProps["data"][0]) => data.time;
  const dateScale = scaleBand<string>({
    domain: props.data.map(getDate),
  });
  const cityScale = scaleBand<string>({
    domain: keys,
  });
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  return (
    <div className={style.container}>
      <svg width={width} height={height} className={style.svg}>
        <Group top={margin.top} left={margin.left}>
          <BarGroup
            data={props.data.map((item) => {
              return {
                ...item,
                v1: item.v1 instanceof Array ? item.v1.reduce((count, item) => item + count) * 100 : item.v1,
              };
            })}
            keys={keys}
            height={yMax}
            x0={getDate}
            x0Scale={dateScale}
            x1Scale={cityScale}
            yScale={tempScale}
            color={colorScale}
          >
            {(barGroups) => {
              return barGroups.map((barGroup, barIndex) => (
                <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                  {barGroup.bars.map((bar, index) => {
                    if (props.data[barIndex][bar.key] instanceof Array) {
                      const firstNumber = props.data[barIndex][bar.key][0] * 100;
                      const secondNumber = props.data[barIndex][bar.key][1] * 100;
                      const firstHeight = bar.height * (firstNumber / bar.value);
                      const secondHeight = bar.height * (secondNumber / bar.value);
                      return (
                        <ReportTooltip
                          key={`bar-group-top-${barGroup.index}`}
                          hideTotal
                          content={[
                            { count: Math.ceil(firstNumber) + (props.itemUnit || ""), type: Object(props.label)[bar.key][0] },
                            { count: Math.ceil(secondNumber) + (props.itemUnit || ""), type: Object(props.label)[bar.key][1] },
                            {
                              count: Math.ceil(bar.value) + (props.itemUnit || ""),
                              type: d("Total").t("report_student_usage_total"),
                            },
                          ]}
                        >
                          <g>
                            <rect
                              key={`bar-group-top-${barGroup.index}`}
                              x={(xMax / props.data.length - 38 * 3) / 2 + 1}
                              y={bar.y || 0}
                              width={26}
                              height={secondHeight ? secondHeight : 0}
                              fill={"#EDEDED"}
                              stroke={"#0E78D5"}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                            <rect
                              key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                              x={(xMax / props.data.length - 38 * 3) / 2 + index * 38}
                              y={bar.y + secondHeight || 0}
                              width={28}
                              height={firstHeight ? firstHeight : 0}
                              fill={bar.color}
                              style={{
                                cursor: "pointer",
                              }}
                            />
                          </g>
                        </ReportTooltip>
                      );
                    }
                    return (
                      <ReportTooltip
                        key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                        hideTotal
                        content={[{ count: bar.value + (props.itemUnit || ""), type: Object(props.label)[bar.key] }]}
                      >
                        <rect
                          x={(xMax / props.data.length - 38 * 3) / 2 + index * 38}
                          y={bar.y || 0}
                          width={28}
                          height={bar.value ? bar.height : 0}
                          fill={bar.color}
                          style={{
                            cursor: "pointer",
                          }}
                        />
                      </ReportTooltip>
                    );
                  })}
                </Group>
              ));
            }}
          </BarGroup>
        </Group>
        <AxisBottom
          top={yMax + margin.top}
          scale={dateScale}
          stroke={"#e0e0e0"}
          hideTicks
          tickLabelProps={() => ({
            fill: "#999999",
            fontSize: 14,
            textAnchor: "middle",
          })}
        />
      </svg>
      <div className={style.background}>
        <div className={style.line}></div>
      </div>
      <span className={style.standard}>100%</span>
      <span className={style.standard50}>50%</span>
    </div>
  );
}

export default function StudentProgressBarChart(props: Omit<BarGroupProps, "height" | "width">) {
  return (
    <ParentSize>
      {(info) => {
        if ((props.durationTime === 4 && props.data.length === 4) || (props.durationTime === 6 && props.data.length === 6)) {
          return <Chart height={info.height} width={info.width} {...props} />;
        }
        return <></>;
      }}
    </ParentSize>
  );
}
