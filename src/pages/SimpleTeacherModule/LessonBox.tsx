import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { getLessonPlan } from "./utils/api";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingWrap: {
    marginBottom: vw(47),
  },
  title: {
    fontWeight: 700,
    fontSize: vw(27),
    lineHeight: vw(34),
    marginBottom: vw(19),
  },
});

export default function LessonBox(prop: { unit: IUnitState }) {
  const css = useStyles();
  const [state, setState] = React.useState({
    lessonPlans: [],
    teachingList: [],
  });
  useEffect(() => {
    let { unit } = prop;
    const getLesson = async () => {
      const data = await getLessonPlan(unit.id);
      let teachingData: [] = [];
      const pre = localStorage.getItem("selectPlan");
      const preList = pre && JSON.parse(pre);
      if (preList && preList.length > 2) {
        teachingData = preList.filter((item: IPlanList, index: number) => {
          return index < 3;
        });
      } else {
        teachingData = preList.concat(data).filter((item: IPlanList, index: number) => {
          return index < 3;
        });
      }
      setState((state) => ({
        lessonPlans: data,
        teachingList: teachingData,
      }));
    };
    unit && getLesson();
  }, [prop]);
  return (
    <Box>
      <Typography className={css.title}>Continue Teaching</Typography>
      <Box className={css.teachingWrap}>
        <TeachingUnit unit={prop.unit} list={state.teachingList}></TeachingUnit>
      </Box>
      <Typography className={css.title}>Unit {prop.unit.name} Teddy Bear, Teddy Bear, Say Goodnight</Typography>
      <LessonUnit list={state.lessonPlans}></LessonUnit>
    </Box>
  );
}
