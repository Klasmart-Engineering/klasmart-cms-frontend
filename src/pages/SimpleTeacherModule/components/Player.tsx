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
  playerTop: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  playerTitle: {
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
    fontSize: px2vw(35),
    lineHeight: px2vw(50),
    marginBottom: px2vw(12),
    "& > b": {
      color: "#1063C6",
    },
  },
  playerProgress: {
    color: "#fff",
    fontSize: px2vw(26),
    lineHeight: px2vw(50),
    height: px2vw(50),
    paddingLeft: px2vw(34),
    paddingRight: px2vw(34),
    background: "#6B9BFC",
    borderRadius: px2vw(50),
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
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
      <Box className={css.playerTop}>
        <Typography variant="h5" className={css.playerTitle}>
          <b>Lesson 1.</b>
          Teddy Bear, Teddy Bear, Say Goodnight
        </Typography>
        <Box className={css.playerProgress}>1/30</Box>
      </Box>
      <Box className={css.playerMain}></Box>
      <Box></Box>
    </Box>
  );
}
