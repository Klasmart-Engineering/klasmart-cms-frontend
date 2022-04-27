import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { StmContext } from "..";
import vw from "../utils/vw.macro";
import MediaControl from "./MediaControl";
import Video from "./Video";

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
  videoContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    "& > video": {
      width: "100%",
      height: "100%",
      background: "#000000",
    },
  },
  playerIframe: {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: "none",
  },
  mediaControl: {
    width: "100%",
    background: "#ffffff",
    borderRadius: vw(32),
    marginTop: vw(12),
    height: vw(100),
    display: "flex",
    alignItems: "center",
  },
});
export default function PresentPlayer(props: IPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const css = useStyles();
  const { data, name, progress, lessonNo } = props;
  const { setRootState, ...rootState } = useContext(StmContext);
  const { videoState } = rootState;

  const isMedia = data.file_type === 2;

  React.useEffect(() => {
    setRootState &&
      setRootState({
        ...rootState,
        videoState: {
          ...videoState,
          isMedia: isMedia,
        },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMedia]);

  return (
    <Box className={css.root}>
      <Box className={css.playerTop}>
        <Typography variant="h5" className={css.playerTitle}>
          <b>Lesson {lessonNo}.</b> {name}
        </Typography>
        <Box className={css.playerProgress}>{progress}</Box>
      </Box>
      <Box className={css.playerMain}>
        {isMedia && (
          <Box className={css.videoContainer}>
            <Video ref={videoRef} source={data.source} />
          </Box>
        )}
        {data.file_type === 5 && (
          <iframe
            title={name}
            className={css.playerIframe}
            sandbox="allow-same-origin allow-scripts"
            src={`//live.kidsloop.live/h5p/play/${data.source}`}
          />
        )}
      </Box>
      {isMedia && (
        <Box className={css.mediaControl}>
          <MediaControl videoRef={videoRef} />
        </Box>
      )}
    </Box>
  );
}
