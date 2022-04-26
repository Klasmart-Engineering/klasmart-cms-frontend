import { Box, Button, Divider, makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { pageLinks } from "..";
import emitter from "../utils/event";
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
export default function PresentNav() {
  const css = useStyles();
  const history = useHistory();
  const sendEvent = (eventName: string) => () => {
    emitter.emit("cmd", eventName);
  };
  const actionBtns = [
    {
      src: require("@assets/stm/play2.png").default,
      cmd: "play",
    },
    {
      src: require("@assets/stm/prev.png").default,
      cmd: "prev",
    },
    {
      src: require("@assets/stm/next.png").default,
      cmd: "next",
    },
    {
      src: require("@assets/stm/fullscreen.png").default,
      cmd: "fullscreen",
    },
    {
      src: require("@assets/stm/sound.png").default,
      cmd: "sound",
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
        <Divider />
      </Box>
      {actionBtns.map((item) => {
        return (
          <Box key={item.cmd} className={clsx(css.iconBase, css.iconWrapper4)}>
            <Icon src={item.src} onClick={sendEvent(item.cmd)} />
          </Box>
        );
      })}
    </Box>
  );
}
