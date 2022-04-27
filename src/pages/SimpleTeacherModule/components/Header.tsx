import backArrow from "@assets/stm/arrow.svg";
import { IconButton, Link, makeStyles, withStyles } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
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
  },
  title: {
    position: "absolute",
    display: "inline-block",
    left: "50%",
    top: "50%",
    marginTop: `-${vw(10)}`,
    marginLeft: `-${vw(10)}`,
  },
  unitBtn: {
    height: vw(35),
    padding: `0 ${vw(10)}`,
    lineHeight: vw(35),
    color: "#C572FF",
    borderRadius: vw(17),
    fontSize: vw(21),
    fontWeight: 800,
    backgroundColor: "#FFFFFF",
  },
  lessonNo: {
    display: "inline-block",
    marginLeft: vw(8),
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: vw(29),
  },
});
export default function Header(props: { prevLink: string; backgroudColor?: React.CSSProperties["backgroundColor"] }) {
  const css = useStyles();
  let history = useHistory();

  return (
    <Link
      component="div"
      variant="body2"
      className={css.root}
      style={{
        backgroundColor: props.backgroudColor || "transpant",
      }}
      onClick={() => {
        history.push(props.prevLink);
      }}
    >
      <BackButton aria-label="back" className={css.backBtn}>
        <img src={backArrow} alt="back" />
      </BackButton>
    </Link>
  );
}
