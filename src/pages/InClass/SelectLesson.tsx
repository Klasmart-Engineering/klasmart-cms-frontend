import { Box, makeStyles } from "@material-ui/core";
import Header from "./components/Header";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#C5DDFF",
  },
});

export default function SelectLesson() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Header backgroudColor={"#43A1FF"} />
    </Box>
  );
}
