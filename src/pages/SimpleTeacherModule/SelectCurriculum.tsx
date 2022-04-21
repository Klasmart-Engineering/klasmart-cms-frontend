import eslImg from "@assets/stm/esl.png";
import steamImg from "@assets/stm/steam.png";
import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { pageLinks, StmContext } from "./index";

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
    fontSize: "2.7vw",
    paddingBottom: "2.1vw",
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
    color: "#274EAF",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: "25.3vw 25.3vw",
    gridColumnGap: "1.7vw",
  },
  item: {
    background: "#fff",
    width: "25.3vw",
    height: "15.3vw",
    borderRadius: "3vw 1.5vw 3vw 3vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& > img": {
      scale: ".8",
    },
  },
});

function CurriculumItem(props: { name: IContextState["curriculum"] }) {
  let history = useHistory();
  const css = useStyles();
  const { setRootState } = useContext(StmContext);
  return (
    <Link
      component="button"
      variant="body2"
      onClick={() => {
        setRootState && setRootState({ curriculum: props.name });
        history.push(pageLinks.level);
      }}
    >
      <Box className={css.item}>
        <img src={props.name === "steam" ? steamImg : eslImg} alt={props.name} />
      </Box>
    </Link>
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
