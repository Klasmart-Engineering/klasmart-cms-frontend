import eslImg from "@assets/stm/esl.png";
import steamImg from "@assets/stm/steam.png";
import { Box, Button, makeStyles, Typography, withStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { StmContext } from "./contexts";
import { pageLinks } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url('${require("@assets/stm/bg.jpg").default}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    fontSize: vw(69),
    lineHeight: vw(86),
    paddingBottom: vw(54),
    fontFamily: "RooneySans, sans-serif",
    fontWeight: 900,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
    color: "#274EAF",
  },
  itemContainer: {
    display: "flex",
    alignItems: "flex-start",
    height: vw(415),
    gap: vw(46),
  },
});

const IconButton = withStyles({
  root: {
    background: "#fff",
    width: vw(648),
    height: vw(392),
    borderRadius: `${vw(100)} ${vw(40)} ${vw(100)}  ${vw(100)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    "& img": {
      height: vw(276),
    },
    "&:hover": {
      transform: "scale(1.06)",
      backgroundColor: "#fff",
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

function CurriculumItem(props: { name: IContextState["curriculum"] }) {
  const history = useHistory();
  const { setRootState, ...rootState } = useContext(StmContext);
  return (
    <IconButton
      onClick={() => {
        history.push(pageLinks.level);
        setRootState && setRootState({ ...rootState, curriculum: props.name });
      }}
    >
      <img src={props.name === "steam" ? steamImg : eslImg} alt={props.name} />
    </IconButton>
  );
}

export default function SelectCurriculum() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Typography className={css.title} variant="h3">
        Select your curriculum
      </Typography>
      <Box className={css.itemContainer}>
        <CurriculumItem name="esl" />
        <CurriculumItem name="steam" />
      </Box>
    </Box>
  );
}
