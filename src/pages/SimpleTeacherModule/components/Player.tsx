import { Box, makeStyles, Typography } from "@material-ui/core";
import vw from "../utils/vw.macro";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#D4E5FF",
    flex: "1 1",
    padding: `${vw(51)} ${vw(29)} ${vw(46)} ${vw(29)}`,
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
    fontSize: vw(35),
    lineHeight: vw(50),
    marginBottom: vw(12),
    "& > b": {
      color: "#1063C6",
    },
  },
  playerProgress: {
    color: "#fff",
    fontSize: vw(26),
    lineHeight: vw(50),
    height: vw(50),
    paddingLeft: vw(34),
    paddingRight: vw(34),
    background: "#6B9BFC",
    borderRadius: vw(50),
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
  playerMain: {
    width: "100%",
    height: "100%",
    background: "#ffffff",
    borderRadius: vw(32),
    position: "relative",
    overflow: "hidden",
  },
  playerIframe: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "none",
  },
});
export default function PresentPlayer(props: IPlayerProps) {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Box className={css.playerTop}>
        <Typography variant="h5" className={css.playerTitle}>
          <b>Lesson {props.lessonNo}.</b> {props.name}
        </Typography>
        <Box className={css.playerProgress}>{props.progress}</Box>
      </Box>
      <Box className={css.playerMain}>
        {props.data.file_type === 5 && (
          <iframe
            title={props.name}
            className={css.playerIframe}
            sandbox="allow-same-origin allow-scripts"
            src={`//live.kidsloop.live/h5p/play/${props.data.source}`}
          />
        )}
      </Box>
      <Box></Box>
    </Box>
  );
}
