import { Box, Grid, makeStyles } from "@material-ui/core";
import Header from "./components/Header";
import UnitsSelector from "./components/UnitsSeletor";
import LessonBox from "./LessonBox";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#C5DDFF",
    position: "relative",
  },
  container: {
    height: "100%",
  },
  lessonbox: {
    position: "absolute",
    left: vw(324),
    top: vw(257),
  },
  unitSelector: {
    paddingLeft: vw(110),
    paddingTop: vw(130),
    width: vw(130),
    height: `calc(100% - ${vw(130)})`,
    margin: 0,
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
      <Grid className={css.container}>
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
