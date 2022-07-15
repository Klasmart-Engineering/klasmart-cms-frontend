import makeStyles from "@mui/styles/makeStyles";
import React, { useReducer } from "react";
import AssetLoading from "./AssetLoading";

const useStyles = makeStyles((theme) => ({
  assetsContent: {
    maxWidth: "100%",
    maxHeight: "100%",
  },
}));

interface img {
  src: string | undefined;
}

export default function AssetImg(props: img) {
  const css = useStyles();
  const [loaded, dispatchLoaded] = useReducer(() => true, false);
  const display = loaded ? "inline-block" : "none";
  return (
    <>
      {!loaded && <AssetLoading />}
      <img className={css.assetsContent} onLoad={dispatchLoaded} src={props.src} alt="assetImg" style={{ display }} />
    </>
  );
}
