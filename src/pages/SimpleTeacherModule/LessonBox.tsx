import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import LessonUnit from "./LessonUnit";
import TeachingUnit from "./TeachingUnit";
import { geUnits } from "./utils/api";
import { px2vw } from "./utils/index";

const useStyles = makeStyles({
  lessonbox: {
    // width: px2vw(670),
    // height: px2vw(300),
    // backgroundColor: "#C572FF",
    // borderRadius: px2vw(46),
  },
  teachingWrap: {
    marginBottom: px2vw(47),
  },
  title: {
    fontWeight: 700,
    fontSize: px2vw(27),
    lineHeight: px2vw(34),
    marginBottom: px2vw(19),
  },
});

export default function LessonBox() {
  const css = useStyles();
  // const dispatch = useDispatch();
  useEffect(() => {
    const getResource = async () => {
      const { payload } = await geUnits();
      console.log(payload);
    };
    getResource();

    const getLessonPlan = async () => {
      const { payload } = await geUnits();
      console.log(payload);
    };
    getLessonPlan();

    const geLessonMaterials = async () => {
      const { payload } = await geUnits();
      console.log(payload);
    };
    geLessonMaterials();
  });
  return (
    <Box className={css.lessonbox}>
      <Typography className={css.title}>Continue Teaching</Typography>
      <Box className={css.teachingWrap}>
        <TeachingUnit></TeachingUnit>
      </Box>
      <Typography className={css.title}>Unit 1. Teddy Bear, Teddy Bear, Say Goodnight</Typography>
      <LessonUnit></LessonUnit>
    </Box>
  );
}
