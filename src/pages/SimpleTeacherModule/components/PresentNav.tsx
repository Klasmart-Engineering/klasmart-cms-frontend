import { Box, Button, Divider, makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { usePresentState, useVideoState } from "../hooks/rootState";
import { pageLinks } from "../index";
import vw from "../utils/vw.macro";

const useStyles = makeStyles({
  root: {
    width: vw(110),
    height: "100vh",
    backgroundColor: "#ffffff",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconBase: {
    width: vw(56),
  },
  iconWrapper: {
    marginTop: vw(37),
  },
  iconWrapper2: {
    marginTop: vw(44),
  },
  iconWrapper3: {
    marginTop: vw(44),
    marginBottom: vw(44),
  },
  iconWrapper4: {
    marginBottom: vw(28),
  },
  divider: {
    margin: "0 auto",
    width: vw(32),
    height: 0,
    border: "1px solid #E4E4E4",
  },
});

const IconButton = withStyles({
  root: {
    backgroundColor: "#fff",
    width: vw(56),
    minWidth: vw(56),
    height: vw(56),
    padding: 0,
    "& img": {
      width: vw(42),
    },
    "&:hover": {
      backgroundColor: "#f0f0f0",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "none",
      borderColor: "none",
    },
  },
})(Button);

function Icon(props: INavIcon) {
  return (
    <IconButton onClick={props.onClick}>
      <img src={props.src} alt="back" />
    </IconButton>
  );
}
export default function PresentNav({ videoRef }: IPresentNavProps) {
  const css = useStyles();
  const history = useHistory();
  const { presentState, setPresentState } = usePresentState();
  const { videoState } = useVideoState();
  const { activeIndex = 0, listLength = 0, isFullscreen = false } = presentState || {};
  const { isMedia, isPlaying, isMute } = videoState || {};

  const handleClick = (eventName: string) => () => {
    console.log(eventName);
    let _activeIndex = activeIndex;
    if (eventName === "prev") {
      _activeIndex = Math.max(0, activeIndex - 1);
      setPresentState({
        activeIndex: _activeIndex,
      });
    }
    if (eventName === "next") {
      _activeIndex = Math.min(listLength - 1, activeIndex + 1);
      setPresentState({
        activeIndex: _activeIndex,
      });
    }
    if (eventName === "fullscreen" || eventName === "exitFullscreen") {
      setPresentState({
        isFullscreen: !isFullscreen,
      });
    }
    if (eventName === "play" || eventName === "pause") {
      if (videoRef.current) {
        const video = videoRef.current;
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      }
    }
    if (eventName === "mute" || eventName === "unmute") {
      if (videoRef.current) {
        const video = videoRef.current;
        if (video.muted) {
          video.muted = false;
        } else {
          video.muted = true;
        }
      }
    }
  };
  const actionBtns = [
    {
      src: require("@assets/stm/play2.png").default,
      eventName: "play",
      display: isMedia && !isPlaying,
    },
    {
      src: require("@assets/stm/pause.png").default,
      eventName: "pause",
      display: isMedia && isPlaying,
    },
    {
      src: require("@assets/stm/prev.png").default,
      eventName: "prev",
      display: true,
    },
    {
      src: require("@assets/stm/next.png").default,
      eventName: "next",
      display: true,
    },
    {
      src: require("@assets/stm/fullscreen.png").default,
      eventName: "fullscreen",
      display: !isFullscreen,
    },
    {
      src: require("@assets/stm/normalscreen.png").default,
      eventName: "exitFullscreen",
      display: isFullscreen,
    },
    {
      src: require("@assets/stm/sound.png").default,
      eventName: "mute",
      display: isMedia && !isMute,
    },
    {
      src: require("@assets/stm/mute.png").default,
      eventName: "unmute",
      display: isMedia && isMute,
    },
  ];
  return (
    <Box className={css.root}>
      <Box className={clsx(css.iconBase, css.iconWrapper)}>
        <Icon
          src={require("@assets/stm/back2.png").default}
          onClick={() => {
            history.push(pageLinks.lesson);
          }}
        />
      </Box>
      <Box className={clsx(css.iconBase, css.iconWrapper2)}>
        <Icon
          src={require("@assets/stm/home.png").default}
          onClick={() => {
            history.push(pageLinks.curriculum);
          }}
        />
      </Box>
      <Box className={clsx(css.iconBase, css.iconWrapper3)}>
        <Divider className={css.divider} />
      </Box>
      {actionBtns
        .filter((item) => item.display)
        .map((item) => {
          return (
            <Box key={item.eventName} className={clsx(css.iconBase, css.iconWrapper4)}>
              <Icon src={item.src} onClick={handleClick(item.eventName)} />
            </Box>
          );
        })}
    </Box>
  );
}
