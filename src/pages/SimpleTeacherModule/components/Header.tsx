import backArrow from "@assets/stm/arrow.svg";
import { Box, IconButton, Link, makeStyles, withStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { StmContext } from "../contexts";
import vw from "../utils/vw.macro";

const BackButton = withStyles({
  root: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  label: {
    "& > img": {
      width: vw(30),
      marginLeft: -5,
    },
  },
})(IconButton);

const useStyles = makeStyles({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    padding: vw(26),
    zIndex: 10,
  },
  backBtn: {
    background: "#fff",
    width: vw(72),
    height: vw(72),
    borderRadius: "100%",
    zIndex: 2,
  },
  title: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    fontFamily: "RooneySans",
    fontWeight: 800,
  },
  unitBtn: {
    height: vw(50),
    padding: `${vw(5)} ${vw(12)}`,
    color: "#fff",
    borderRadius: vw(16),
    fontSize: vw(30),
    marginRight: vw(10),
    backgroundColor: "#C572FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  skill: {
    fontSize: vw(40),
    lineHeight: vw(50),
    textAlign: "center",
    color: "#fff",
  },
  lessonNo: {
    display: "inline-block",
    marginLeft: vw(8),
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: vw(29),
  },
});

interface Props {
  prevLink: string;
  backgroudColor?: React.CSSProperties["backgroundColor"];
  showTitle?: boolean;
}
export default function Header(props: Props) {
  const css = useStyles();
  let history = useHistory();
  const rootState = useContext(StmContext);

  return (
    <Link
      component="div"
      variant="body2"
      className={css.root}
      style={{
        backgroundColor: props.backgroudColor || "transpant",
      }}
    >
      <BackButton
        aria-label="back"
        className={css.backBtn}
        onClick={() => {
          history.push(props.prevLink);
        }}
      >
        <img src={backArrow} alt="back" />
      </BackButton>
      {props.showTitle && (
        <Box className={css.title}>
          <Box className={css.unitBtn}>Level&nbsp;{rootState.classLevel}</Box>
          <Box className={css.skill}>{rootState.title}</Box>
        </Box>
      )}
    </Link>
  );
}
