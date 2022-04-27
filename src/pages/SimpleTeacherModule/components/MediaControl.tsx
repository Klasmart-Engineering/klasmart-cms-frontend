import muteButton from "@assets/stm/mute.png";
import pauseButton from "@assets/stm/pause.png";
import playButton from "@assets/stm/play.png";
import soundButton from "@assets/stm/sound.png";
import { Box, IconButton, makeStyles, Slider, withStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { StmContext } from "..";
import { hhmmss } from "../utils/time";
import vw from "../utils/vw.macro";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flex: "1",
    marginLeft: vw(50),
    marginRight: vw(53),
  },
  iconButton: {
    "& img": {
      height: vw(34),
    },
  },
  progress: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
  },
  progressTimeLeft: {
    paddingLeft: vw(46),
    paddingRight: vw(16),
  },
  progressTimeRight: {
    paddingLeft: vw(16),
    paddingRight: vw(46),
  },
  sound: {
    width: vw(197),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const ProgressSlider = withStyles({
  root: {
    color: "#2475EA",
    height: vw(8),
  },
  thumb: {
    display: "none",
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: vw(8),
    borderRadius: vw(4),
  },
  rail: {
    height: vw(8),
    borderRadius: vw(4),
  },
})(Slider);

const VolumeSlider = withStyles({
  root: {
    color: "#2475EA",
    height: vw(8),
    marginLeft: vw(10),
  },
  thumb: {
    height: vw(24),
    width: vw(24),
    backgroundColor: "#2475EA",
    border: "2px solid currentColor",
    marginTop: `-${vw(8)}`,
    marginLeft: `-${vw(12)}`,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: vw(8),
    borderRadius: vw(4),
  },
  rail: {
    height: vw(8),
    borderRadius: vw(4),
  },
})(Slider);

export default function MediaControl({ videoRef }: IMediaControlProps) {
  const css = useStyles();
  const { setRootState, ...rootState } = useContext(StmContext);
  const { videoState } = rootState;
  const { isPlaying, isMute, currentTime, duration } = videoState || {};

  const videoEvents = ["loadedmetadata", "timeupdate", "play", "ended", "pause", "seeking", "volumechange"];
  const handleVideoEvent = () => {
    if (videoRef.current) {
      const video = videoRef.current;

      const isVideoPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
      setRootState &&
        setRootState({
          ...rootState,
          videoState: {
            ...videoState,
            isMedia: true,
            isPlaying: isVideoPlaying,
            isMute: video.muted,
            currentTime: video.currentTime,
            duration: video.duration,
          },
        });
    }
  };

  const getProgress = () => {
    if (currentTime && duration && duration > 0) {
      return Math.floor((currentTime / duration) * 100);
    } else {
      return 0;
    }
  };

  const getVolume = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      return video.muted ? 0 : video.volume * 100;
    } else {
      return 0;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  const toggleMuted = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.muted) {
        video.muted = false;
      } else {
        video.muted = true;
      }
    }
  };

  const changeProgress = (event: any, newValue: number | number[]) => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.currentTime = ((newValue as number) / 100) * duration!;
    }
  };
  const changeVolume = (event: any, newValue: number | number[]) => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.volume = (newValue as number) / 100;
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      videoEvents.forEach((event) => {
        video.addEventListener(event, handleVideoEvent);
      });
      return () => {
        videoEvents.forEach((event) => {
          video.removeEventListener(event, handleVideoEvent);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className={css.root}>
      <IconButton size="small" onClick={togglePlay} className={css.iconButton}>
        {!isPlaying ? <img src={playButton} alt="play" /> : <img src={pauseButton} alt="pause" />}
      </IconButton>
      <Box className={css.progress}>
        <Box className={css.progressTimeLeft}>{hhmmss(currentTime || 0)}</Box>
        <ProgressSlider value={getProgress()} onChange={changeProgress} aria-labelledby="progress-slider" />
        <Box className={css.progressTimeRight}>{hhmmss(duration || 0)}</Box>
      </Box>
      <Box className={css.sound}>
        <IconButton size="small" onClick={toggleMuted} className={css.iconButton}>
          {isMute ? <img src={muteButton} alt="play" /> : <img src={soundButton} alt="pause" />}
        </IconButton>
        <VolumeSlider value={getVolume()} onChange={changeVolume} aria-labelledby="volume-slider" />
      </Box>
    </Box>
  );
}
