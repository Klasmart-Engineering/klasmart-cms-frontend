import { Box, Button, Divider, makeStyles, withStyles } from "@material-ui/core";
import clsx from "clsx";
import { px2vw } from "../utils";

const useStyles = makeStyles({
  root: {
    width: px2vw(110),
    height: "100vh",
    backgroundColor: "#ffffff",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  iconBase: {
    width: px2vw(56),
  },
  iconWrapper: {
    marginTop: px2vw(37),
  },
  iconWrapper2: {
    marginTop: px2vw(44),
  },
  iconWrapper3: {
    marginTop: px2vw(44),
    marginBottom: px2vw(44),
  },
  iconWrapper4: {
    marginBottom: px2vw(28),
  },
});

const IconButton = withStyles({
  root: {
    backgroundColor: "#fff",
    width: px2vw(56),
    minWidth: px2vw(56),
    height: px2vw(56),
    padding: 0,
    "& img": {
      width: px2vw(42),
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
    <IconButton>
      <img src={props.src} alt="back" />
    </IconButton>
  );
}
export default function PresentNav() {
  const css = useStyles();
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
      cmd: "next",
    },
    {
      src: require("@assets/stm/sound.png").default,
      cmd: "sound",
    },
  ];
  return (
    <Box className={css.root}>
      <Box className={clsx(css.iconBase, css.iconWrapper)}>
        <Icon src={require("@assets/stm/back2.png").default} />
      </Box>
      <Box className={clsx(css.iconBase, css.iconWrapper2)}>
        <Icon src={require("@assets/stm/home.png").default} />
      </Box>
      <Box className={clsx(css.iconBase, css.iconWrapper3)}>
        <Divider />
      </Box>
      {actionBtns.map((item) => {
        return (
          <Box key={item.cmd} className={clsx(css.iconBase, css.iconWrapper4)}>
            <Icon src={item.src} />
          </Box>
        );
      })}
    </Box>
  );
}
