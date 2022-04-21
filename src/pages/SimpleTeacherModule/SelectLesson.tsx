import { Box, makeStyles } from "@material-ui/core";
import Header from "./components/Header";
import LessonBox from "./LessonBox";
import { px2vw } from "./utils/index";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#C5DDFF",
    position: "relative",
  },
  lessonbox: {
    position: "absolute",
    left: px2vw(324),
    top: px2vw(257),
  },
});

export default function SelectLesson() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Header backgroudColor={"#43A1FF"} prevLink="/stm/level" />
      <Box className={css.lessonbox}>
        <LessonBox></LessonBox>
      </Box>
    </Box>
  );
}
