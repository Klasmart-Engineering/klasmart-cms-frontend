import { makeStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",
  },
});
export default function PresentActivity() {
  const css = useStyles();
  return <div className={css.root}></div>;
}
