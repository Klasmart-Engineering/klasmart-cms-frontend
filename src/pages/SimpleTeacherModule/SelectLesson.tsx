import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import Header from "./components/Header";
import UnitsSelector from "./components/UnitsSeletor";
import { StmContext } from "./contexts";
import LessonBox from "./LessonBox";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#C5DDFF",
    position: "relative",
    fontFamily: "RooneySans, sans-serif",
    fontWeight: 800,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "row",
    padding: `${vw(130)} 0 0 0`,
    boxSizing: "border-box",
  },
  lessonbox: {
    height: "100%",
    width: "100%",
    overflowY: "scroll",
  },
  unitSelector: {
    paddingBottom: vw(20),
    margin: `0 ${vw(75)} 0 ${vw(97)}`,
    boxSizing: "border-box",
    width: vw(130),
    height: "100%",
  },
});

export default function SelectLesson() {
  const css = useStyles();
  const [unit, setUnit] = useState<IUnitState>({ id: "unit01", name: "01", no: 1, lesson_plans: [] });
  const { setRootState, ...rootState } = useContext(StmContext);
  const { currentUnit } = rootState;
  const unitChange = (unit: IUnitState) => {
    rootState.scrollTo?.(unit.id);
    setUnit(unit);
  };

  useEffect(() => {
    return () => {
      setRootState?.({ ...rootState, currentUnit: undefined });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={css.root}>
      <Header showTitle backgroudColor={"#43A1FF"} prevLink="/stm/level" />
      <Grid className={css.container}>
        <Box className={css.unitSelector}>
          <UnitsSelector chosenUnit={currentUnit} onChange={unitChange} />
        </Box>
        <Box id="lessonbox" className={css.lessonbox}>
          <LessonBox unit={unit}></LessonBox>
        </Box>
      </Grid>
    </Box>
  );
}
