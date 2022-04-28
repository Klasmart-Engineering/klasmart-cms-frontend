import muteButton from "@assets/stm/mute.png";
import pauseButton from "@assets/stm/pause.png";
import playButton from "@assets/stm/play.png";
import soundButton from "@assets/stm/sound.png";
import { Box, IconButton, makeStyles, Slider, withStyles } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useVideoState } from "../hooks/rootState";
import { hhmmss } from "../utils/time";
import vw from "../utils/vw.macro";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: vw(99),
    flex: "1",
    marginLeft: vw(59),
    marginRight: vw(53),
  },
  iconButton: {
    padding: 0,
    "& img": {
      height: vw(48),
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
  progressTime: {
    fontFamily: "RooneySans, sans-serif",
    fontWeight: 500,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
    fontSize: vw(27),
    color: "#696A70",
  },
  progressTimeLeft: {
    paddingLeft: vw(46),
    paddingRight: vw(16),
  },
  progressTimeRight: {
    paddingLeft: vw(16),
    paddingRight: vw(56),
  },
  sound: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: vw(197),
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
    backgroundColor: "#D8DFE8",
  },
})(Slider);

const VolumeSlider = withStyles({
  root: {
    color: "#2475EA",
    width: vw(140),
    height: vw(8),
    marginLeft: vw(10),
  },
  thumb: {
    height: vw(20),
    width: vw(20),
    backgroundColor: "#2475EA",
    border: "2px solid currentColor",
    marginTop: `-${vw(7)}`,
    marginLeft: `-${vw(10)}`,
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
    backgroundColor: "#D8DFE8",
  },
})(Slider);

export default function MediaControl({ videoRef }: IMediaControlProps) {
  const css = useStyles();

  const { videoState, setVideoState } = useVideoState();
  const { isPlaying, isMute, currentTime, duration } = videoState || {};

  const videoEvents = ["loadedmetadata", "timeupdate", "play", "ended", "pause", "seeking", "volumechange"];
  const handleVideoEvent = () => {
    if (videoRef.current) {
      const video = videoRef.current;

      const isVideoPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
      setVideoState({
        isMedia: true,
        isPlaying: isVideoPlaying,
        isMute: video.muted,
        currentTime: video.currentTime,
        duration: video.duration,
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
      if (video.muted) {
        video.muted = false;
      }
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
        <Box className={clsx(css.progressTime, css.progressTimeLeft)}>{hhmmss(currentTime || 0)}</Box>
        <ProgressSlider value={getProgress()} onChange={changeProgress} aria-labelledby="progress-slider" />
        <Box className={clsx(css.progressTime, css.progressTimeRight)}>{hhmmss(duration || 0)}</Box>
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
