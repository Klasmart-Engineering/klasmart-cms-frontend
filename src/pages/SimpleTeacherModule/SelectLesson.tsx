import { Box, Grid, makeStyles } from "@material-ui/core";
import Header from "./components/Header";
import UnitsSelector from "./components/UnitsSeletor";
import LessonBox from "./LessonBox";
import { px2vw } from "./utils/index";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#C5DDFF",
    position: "relative",
  },
  lessonbox: {
    position: "absolute",
    left: px2vw(324),
    top: px2vw(257),
  },
  unitSelector: {
    position: "absolute",
    left: px2vw(110),
    top: px2vw(130),
    height: px2vw(1352),
  },
});

export default function SelectLesson() {
  const css = useStyles();
  const unitChange = (unit: any) => {
    console.log(unit);
  };
  return (
    <Box className={css.root}>
      <Header backgroudColor={"#43A1FF"} prevLink="/stm/level" />
      <Grid>
        <Box className={css.unitSelector}>
          <UnitsSelector onChange={unitChange} />
        </Box>
        <Box className={css.lessonbox}>
          <LessonBox></LessonBox>
        </Box>
      </Grid>
    </Box>
  );
}
