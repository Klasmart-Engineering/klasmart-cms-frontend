import { t } from "@locale/LocaleManager";
import { Box, Grid } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ReportAchievementList } from "@pages/ReportAchievementList";
import { RootState } from "@reducers/index";
import { ParentSize } from "@visx/responsive";
import { sumBy } from "lodash";
import { useSelector } from "react-redux";
import BottomButton from "./BottomButton";
import StatisticPieCharts from "./StatisticPieCharts";

const useStyles = makeStyles(() => ({
  container: {
    width: "100%",
    height: "321px",
    borderRadius: "12px",
    padding: "0px 19px 19px",
    background: "#fff",
  },
  scoreName: {
    lineHeight: "14px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    fontSize: "13px",
    color: "#A5A5A5",
    fontWeight: "bold",
  },
  scoreValue: {
    fontSize: "30px",
    lineHeight: "35px",
    fontWeight: "bold",
  },
  scoreContainer: {
    width: "25%",
    marginTop: "36px",
    marginLeft: "25px",
    marginRight: "15px",
  },
  scoreItem: {
    marginBottom: "12px",
  },
  titleTip: {
    height: "0px",
    lineHeight: "47px",
    fontSize: "12px",
    color: "#6D8199",
    fontWeight: 600,
  },
  countNumber: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
  },
}));

const COLORS = ["#3ab8f3", "#ffd038", "#e80861"];

export default function LearningOutcomeTabs() {
  const css = useStyles();
  const { achievementCounts } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const count =
    (achievementCounts.achieved_above_count || 0) +
    (achievementCounts.achieved_below_count || 0) +
    (achievementCounts.achieved_meet_count || 0);
  const handleData = [
    {
      name: t("report_label_above"),
      count: count === 0 ? 0 : Math.floor(((achievementCounts.achieved_above_count || 0) / count) * 100),
    },
    {
      name: t("report_label_meets"),
      count: count === 0 ? 0 : Math.floor(((achievementCounts.achieved_meet_count || 0) / count) * 100),
    },
    {
      name: t("report_label_below"),
      count: count === 0 ? 0 : Math.floor(((achievementCounts.achieved_below_count || 0) / count) * 100),
    },
  ];

  const filterData = handleData.filter((item) => item.count);
  if (filterData.length === 2) {
    filterData[1].count = 100 - filterData[0].count;
  } else if (filterData.length === 3) {
    filterData[2].count = 100 - filterData[0].count - filterData[1].count;
  }
  const renderScore = (name: string, number: number, color: string, i: number) => {
    return (
      <Grid container direction="column" className={css.scoreItem} key={i}>
        <div title={name} className={css.scoreName}>
          {name}
        </div>
        <span style={{ color }} className={css.scoreValue}>
          {number}%
        </span>
      </Grid>
    );
  };

  const renderCountNumber = () => {
    return (
      <ParentSize className={css.countNumber}>
        {(info) => {
          return (
            <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
              <Box
                title={t("report_label_covered")}
                color={"#777"}
                width={Math.min(info.width, info.height) - 70}
                textOverflow={"ellipsis"}
                whiteSpace={"nowrap"}
                textAlign={"center"}
                overflow={"hidden"}
              >
                {t("report_label_covered")}
              </Box>
              <Box color={"#14b799"} fontSize={42} fontWeight={"bold"}>
                {achievementCounts.covered_learn_outcome_count}
              </Box>
            </Box>
          );
        }}
      </ParentSize>
    );
  };

  return (
    <Grid container direction="column">
      <Grid wrap="nowrap" container direction="column" className={css.container}>
        <Box className={css.titleTip}>{t("report_label_past_7_days")}</Box>
        <Box flex={1} display={"flex"}>
          <Box
            flex={1}
            display={"flex"}
            marginTop={"44px"}
            marginBottom={"10px"}
            position={"relative"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <ParentSize>
              {(info) => {
                return (
                  <Box position={"absolute"}>
                    <StatisticPieCharts
                      width={info.width}
                      height={info.height}
                      value={sumBy(handleData, "count") === 0 ? Array(3).fill(100 / 3) : handleData.map((item) => item.count || 0)}
                      colors={sumBy(handleData, "count") === 0 ? Array<string>(3).fill("#eee") : COLORS}
                    />
                  </Box>
                );
              }}
            </ParentSize>
            {renderCountNumber()}
          </Box>
          <Grid container direction="column" justifyContent="center" className={css.scoreContainer}>
            {handleData.map((item, i) => renderScore(item.name || "", item.count || 0, COLORS[i], i))}
          </Grid>
        </Box>
        <Grid container justifyContent="center" alignItems="center">
          <BottomButton text={t("report_label_learning_outcome_report")} to={ReportAchievementList.routeBasePath} marginTop={20} />
        </Grid>
      </Grid>
    </Grid>
  );
}
