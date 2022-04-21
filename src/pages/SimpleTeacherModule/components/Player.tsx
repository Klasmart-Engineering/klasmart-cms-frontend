import { Box, makeStyles, Typography } from "@material-ui/core";
import { px2vw } from "../utils";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#D4E5FF",
    flex: "1 1",
    padding: `${px2vw(51)} ${px2vw(29)} ${px2vw(46)} ${px2vw(29)}`,
    display: "flex",
    flexDirection: "column",
  },
  playerMain: {
    width: "100%",
    height: "100%",
    background: "#C4C4C4",
    borderRadius: px2vw(32),
  },
});
export default function PresentPlayer() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Box>
        <Typography variant="h5">Teddy Bear, Teddy Bear, Say Goodnight</Typography>
      </Box>
      <Box className={css.playerMain}></Box>
      <Box></Box>
    </Box>
  );
}
