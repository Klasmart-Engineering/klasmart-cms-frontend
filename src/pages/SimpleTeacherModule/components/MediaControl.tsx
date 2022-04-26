import muteButton from "@assets/stm/mute.png";
import pauseButton from "@assets/stm/pause.png";
import playButton from "@assets/stm/play.png";
import soundButton from "@assets/stm/sound.png";
import { Box, IconButton, makeStyles, Slider, withStyles } from "@material-ui/core";
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
    paddingLeft: vw(16),
    paddingRight: vw(16),
  },
  sound: {
    width: "10%",
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

export default function MediaControl() {
  const css = useStyles();
  const isPlaying = false;
  const isMute = false;
  return (
    <Box className={css.root}>
      <IconButton size="small">{isPlaying ? <img src={playButton} alt="play" /> : <img src={pauseButton} alt="pause" />}</IconButton>
      <Box className={css.progress}>
        <Box className={css.progressTime}>0:30</Box>
        <ProgressSlider value={50} onChange={() => {}} aria-labelledby="progress-slider" />
        <Box className={css.progressTime}>0:24</Box>
      </Box>
      <Box className={css.sound}>
        <IconButton size="small">{isMute ? <img src={muteButton} alt="play" /> : <img src={soundButton} alt="pause" />}</IconButton>
        <VolumeSlider value={50} onChange={() => {}} aria-labelledby="volume-slider" />
      </Box>
    </Box>
  );
}
