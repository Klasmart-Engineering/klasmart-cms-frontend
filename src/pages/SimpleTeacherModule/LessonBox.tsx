import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { StmContext } from "./index";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { getLessonPlan } from "./utils/api";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingWrap: {
    marginBottom: vw(46),
    padding: `${vw(66)} 0 0 0`,
  },
  title: {
    fontSize: vw(27),
    lineHeight: vw(34),
    marginBottom: vw(19),
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
});

export default function LessonBox(prop: { unit: IUnitState }) {
  const css = useStyles();
  const [state, setState] = useState<{ lessonPlans: ITeachingList[]; teachingList: ITeachingList[] }>({
    lessonPlans: [],
    teachingList: [],
  });
  const [showTeach, setShowTeach] = useState<Boolean>(false);
  const [showLesson, setShowLesson] = useState<Boolean>(true);
  const { curriculum, classLevel } = useContext(StmContext);

  useEffect(() => {
    let { unit } = prop;
    let params: {} = { curriculum, classLevel };
    const getLesson = async () => {
      let data: ITeachingList[];
      try {
        data = await getLessonPlan(unit.id, params);
      } catch (error) {
        data = [];
        setShowLesson(false);
      }

      data.map((item) => {
        return (item.unitId = unit.id);
      });
      let teachingData: ITeachingList[] = [];
      const pre = localStorage.getItem("selectPlan");
      const preList: ITeachingList[] = pre && JSON.parse(pre);
      if (preList && preList.length > 0) {
        setShowTeach(true);
        teachingData = preList.filter((item: ITeachingList, index: number) => {
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
    <Box>
      {showTeach && (
        <Box className={css.teachingWrap}>
          <Typography className={css.title}>Continue Teaching</Typography>
          <TeachingUnit list={state.teachingList}></TeachingUnit>
        </Box>
      )}
      {showLesson && (
        <Typography className={css.title}>
          {prop.unit.id} {prop.unit.name}
        </Typography>
      )}
      <LessonUnit list={state.lessonPlans}></LessonUnit>
    </Box>
  );
}
