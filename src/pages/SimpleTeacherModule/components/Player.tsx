import { Box, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { usePresentState } from "../hooks/rootState";
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
  fullScreenRoot: {
    backgroundColor: "#000",
    paddingLeft: 0,
    paddingRight: 0,
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
  playerMainFullScreen: {
    borderRadius: 0,
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
  mediaControlHidden: {
    position: "absolute",
    width: 0,
    height: 0,
    zIndex: -1,
  },
});
const PresentPlayer = React.forwardRef<HTMLVideoElement, IPlayerProps>((props, videoRef) => {
  const css = useStyles();
  const { presentState } = usePresentState();
  const { data, name, thumbnail, lessonNo } = props;

  const isVideo = data.file_type === 2;
  const isAudio = data.file_type === 3;
  const isMedia = isVideo || isAudio;
  const progress = `${(presentState.activeIndex || 0) + 1} / ${presentState.listLength || 0}`;

  return (
    <Box
      className={clsx(css.root, {
        [css.fullScreenRoot]: presentState.isFullscreen,
      })}
    >
      {!presentState.isFullscreen && (
        <Box className={css.playerTop}>
          <Typography variant="h5" className={css.playerTitle}>
            <b>Lesson {lessonNo}.</b> {name}
          </Typography>
          <Box className={css.playerProgress}>{progress}</Box>
        </Box>
      )}

      <Box
        className={clsx(css.playerMain, {
          [css.playerMainFullScreen]: presentState.isFullscreen,
        })}
      >
        {isMedia && (
          <Box className={css.videoContainer}>
            <Video ref={videoRef} poster={thumbnail} source={data.source} />
          </Box>
        )}
        {(data.file_type === 5 || data.file_type === 100) && (
          <iframe
            title={name}
            className={css.playerIframe}
            sandbox="allow-same-origin allow-scripts"
            src={`${data.source.startsWith("http") ? data.source : `//live.kidsloop.live/h5p/play/${data.source}`}`}
          />
        )}
      </Box>
      {isMedia && (
        <Box
          className={clsx(css.mediaControl, {
            [css.mediaControlHidden]: presentState.isFullscreen,
          })}
        >
          <MediaControl videoRef={videoRef as React.RefObject<HTMLVideoElement>} />
        </Box>
      )}
    </Box>
  );
});

export default PresentPlayer;
