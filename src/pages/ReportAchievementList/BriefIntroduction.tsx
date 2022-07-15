import { Box, Divider } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import React from "react";
import { useHistory } from "react-router-dom";
import { EntityScheduleShortInfo } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { GetReportMockOptionsResponse } from "../../reducers/report";
import { QueryCondition } from "./types";

const useStyles = makeStyles(({ breakpoints }) => ({
  container_intro: {
    display: "flex",
    padding: "10px 0 20px 0",
    flexWrap: "wrap",
  },
  colorPart: {
    width: "32px",
    height: "20px",
  },
  blue: {
    backgroundColor: "#8693f0",
  },
  pink: {
    backgroundColor: "#fea69b",
  },
  gray: {
    backgroundColor: "#c9c9c9",
  },
  rightContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    "& div": {
      marginRight: "10px",
    },
    "& span": {
      color: "black",
      fontWeight: 500,
      fontSize: "14px",
    },
  },
  lessonPlan: {
    color: "blue",
    fontWeight: 500,
    cursor: "pointer",
  },
  teacherAndClass: {
    color: "black",
    fontWeight: 500,
  },
  divider: {
    marginTop: "20px",
  },
  leftName: {
    paddingTop: "15px",
    marginRight: "auto",
  },
  marginItem: {
    paddingTop: "15px",
  },
}));

interface BriefIntroductionProps {
  value: QueryCondition;
  student_name: string | undefined;
  hiddenLegend?: Boolean;
  backByLessonPlan?: (urlParams: string) => void;
  reportMockOptions?: GetReportMockOptionsResponse;
}

export default function BriefIntroduction(props: BriefIntroductionProps) {
  const { value, student_name, backByLessonPlan, reportMockOptions, hiddenLegend } = props;
  const lessonPlanList = reportMockOptions?.lessonPlanList;
  const css = useStyles();
  const history = useHistory();
  const [, setLessonPlanName] = React.useState("");
  React.useEffect(() => {
    if (lessonPlanList && lessonPlanList.length) {
      const res = lessonPlanList.filter((item: EntityScheduleShortInfo) => item.id === value.lesson_plan_id)[0];
      if (res && res.name) {
        setLessonPlanName(res.name as typeof backByLessonPlan[keyof typeof backByLessonPlan]);
      }
    }
  }, [backByLessonPlan, lessonPlanList, value.lesson_plan_id]);

  const handleClick = () => {
    if (backByLessonPlan) {
      history.go(-1);
    }
  };

  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <Divider className={css.divider} />
      <Box className={css.container_intro}>
        <Box className={css.leftName}>
          {value.lesson_plan_id && (
            <span
              style={{ cursor: value.student_id ? "pointer" : "default", color: value.student_id ? "blue" : "black" }}
              className={css.lessonPlan}
              onClick={handleClick}
            >
              {d("Class View").t("report_navigation_class_view")}
            </span>
          )}
          {value.student_id && <span className={css.teacherAndClass}>{student_name && ` - ${student_name}`}</span>}
        </Box>
        {!hiddenLegend && (
          <Box className={css.rightContainer}>
            <Box className={clsx(css.rightContainer, css.marginItem)}>
              <div className={clsx(css.colorPart, css.blue)}></div>
              <span>
                {d("All").t("report_label_all")} {d("Achieved").t("report_label_achieved")}
              </span>
            </Box>
            <Box className={clsx(css.rightContainer, css.marginItem)}>
              <div className={clsx(css.colorPart, css.pink)}></div>
              <span>{d("Not Achieved").t("report_label_not_achieved")}</span>
            </Box>
            <Box className={clsx(css.rightContainer, css.marginItem)}>
              <div className={clsx(css.colorPart, css.gray)}></div>
              <span>{d("Not Covered").t("report_label_not_attempted")}</span>
            </Box>
          </Box>
        )}
      </Box>
    </LayoutBox>
  );
}
