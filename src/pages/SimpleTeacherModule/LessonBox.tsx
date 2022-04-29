import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { StmContext } from "./contexts";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { getLessonPlan } from "./utils/api";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  lessonWrap: {
    padding: `${vw(68)} 0 0 ${vw(40)}`,
    fontFamily: "RooneySans",
  },
  teachingWrap: {
    marginBottom: vw(48),
  },
  title: {
    fontFamily: "RooneySans",
    fontWeight: "bold",
    color: "#333333",
    fontSize: vw(27),
    lineHeight: vw(34),
    marginBottom: vw(19),
  },
});

export default function LessonBox(prop: { unit: IUnitState }) {
  const css = useStyles();
  const [state, setState] = useState<{ lessonPlans: ITeachingList[]; teachingList: LessonItem[] }>({
    lessonPlans: [],
    teachingList: [],
  });
  const [showTeach, setShowTeach] = useState<Boolean>(false);
  const { curriculum, classLevel } = useContext(StmContext);

  useEffect(() => {
    let { unit } = prop;
    let params: {} = { curriculum, classLevel };
    const getLesson = async () => {
      let data: ITeachingList[];
      try {
        data = await getLessonPlan(params);
      } catch (error) {
        data = [];
      }
      let teachingData: LessonItem[] = [];
      const pre = localStorage.getItem("selectPlan");
      const preList: LessonItem[] = pre && JSON.parse(pre);
      if (preList && preList.length > 0) {
        setShowTeach(true);
        teachingData = preList.filter((item: LessonItem, index: number) => {
          return index < 3;
        });
      }
      setState({
        lessonPlans: data,
        teachingList: teachingData,
      });
    };
    unit && getLesson();
  }, [prop, curriculum, classLevel]);
  return (
    <Box className={css.lessonWrap}>
      {showTeach && (
        <Box className={css.teachingWrap}>
          <Typography className={css.title}>Continue Teaching</Typography>
          <TeachingUnit list={state.teachingList}></TeachingUnit>
        </Box>
      )}
      <LessonUnit list={state.lessonPlans}></LessonUnit>
    </Box>
  );
}
