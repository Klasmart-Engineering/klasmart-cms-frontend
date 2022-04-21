import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import PresentPlayer from "./components/Player";
import PresentList from "./components/PresentList";
import PresentNav from "./components/PresentNav";

const useStyles = makeStyles({
  root: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "row",
  },
});
export default function PresentActivity() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <PresentNav />
      <PresentList />
      <PresentPlayer />
    </Box>
  );
}
