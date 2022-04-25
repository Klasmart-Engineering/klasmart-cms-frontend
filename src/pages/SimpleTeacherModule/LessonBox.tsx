import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
// import { StmContext } from "./index";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { getLessonPlan } from "./utils/api";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingWrap: {
    marginBottom: vw(46),
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
  // const { unitId } = useContext(StmContext);
  const [state, setState] = useState<{ lessonPlans: ITeachingList[]; teachingList: ITeachingList[] }>({
    lessonPlans: [],
    teachingList: [],
  });
  const [showTeach, setShowTeach] = useState<Boolean>(false);
  useEffect(() => {
    let { unit } = prop;
    const getLesson = async () => {
      let data: ITeachingList[] = await getLessonPlan(unit.id);
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
  }, [prop]);
  return (
    <Box>
      {showTeach && (
        <Box className={css.teachingWrap}>
          <Typography className={css.title}>Continue Teaching</Typography>
          <TeachingUnit list={state.teachingList}></TeachingUnit>
        </Box>
      )}
      <Typography className={css.title}>
        {prop.unit.id} {prop.unit.name}
      </Typography>
      <LessonUnit list={state.lessonPlans}></LessonUnit>
    </Box>
  );
}
