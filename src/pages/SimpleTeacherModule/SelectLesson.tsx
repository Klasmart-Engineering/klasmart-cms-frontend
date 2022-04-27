import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useContext, useState } from "react";
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
    fontWeight: "bold",
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
    margin: `0 ${vw(107)} 0 ${vw(110)}`,
    boxSizing: "border-box",
    width: vw(130),
    height: "100%",
  },
});

export default function SelectLesson() {
  const css = useStyles();
  const [unit, setUnit] = useState<IUnitState>({ id: "unit01", name: "01", no: 1 });
  const { setRootState, ...rootState } = useContext(StmContext);
  const unitChange = (unit: IUnitState) => {
    setRootState && setRootState({ ...rootState, unitId: unit.id });
    setUnit(unit);
  };
  return (
    <Box className={css.root}>
      <Header backgroudColor={"#43A1FF"} prevLink="/stm/level" />
      <Grid className={css.container}>
        <Box className={css.unitSelector}>
          <UnitsSelector onChange={unitChange} />
        </Box>
        <Box className={css.lessonbox}>
          <LessonBox unit={unit}></LessonBox>
        </Box>
      </Grid>
    </Box>
  );
}
