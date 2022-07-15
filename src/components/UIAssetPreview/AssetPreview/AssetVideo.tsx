import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import FastForwardOutlinedIcon from "@mui/icons-material/FastForwardOutlined";
import FastRewindOutlinedIcon from "@mui/icons-material/FastRewindOutlined";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledOutlinedIcon from "@mui/icons-material/PlayCircleFilledOutlined";
import React, { useEffect, useReducer, useRef } from "react";
import AssetLoading from "./AssetLoading";

const useStyles = makeStyles({
  wrap: {
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    maxWidth: "100%",
    maxHeight: "calc(100% - 50px)",
    objectFit: "fill",
  },
  controls: {
    // maxWidth: "100%",
    width: "100%",
    height: "50px",
    backgroundColor: "#0e78d5",
    marginTop: "-4px",
    display: "flex",
    alignItems: "center",
  },
  tools: {
    width: "100px",
    display: "flex",
    justifyContent: "space-around",
  },
  itemTool: {
    cursor: "pointer",
    color: "#fff",
  },
  progress: {
    flex: 1,
    marginLeft: "10px",
    marginRight: "10px",
    color: "#fff",
  },
});

interface video {
  src: string | undefined;
}

export default function AssetVideo(props: video) {
  const classes = useStyles();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [value, setValue] = React.useState<number>(0);
  const [isplay, setIsplay] = React.useState<boolean>(false);
  const [loaded, dispatchLoaded] = useReducer(() => true, false);
  const display = loaded ? "flex" : "none";
  const handleChange = (event: any, newValue: number | number[]) => {
    const video = videoRef.current;
    if (!video) return;
    setValue(newValue as number);
    video.currentTime = video.duration * (newValue as number) * 0.01;
  };

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsplay(!isplay);
    isplay ? video.pause() : video.play();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const timer = setInterval(() => {
      isplay ? setValue((video.currentTime / video.duration) * 100) : clearInterval(timer);
    }, 500);
  });
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !props.src) return;
    video.load();
  }, [props.src]);
  return (
    <>
      {!loaded && <AssetLoading />}
      <Box className={classes.wrap} style={{ display }}>
        <video
          id="video"
          className={classes.video}
          src={props.src}
          onCanPlayThrough={(e) => dispatchLoaded()}
          onClick={handlePlay}
          ref={videoRef}
        ></video>
        <Box className={classes.controls}>
          <Box className={classes.tools}>
            <FastRewindOutlinedIcon className={classes.itemTool} />
            {isplay ? (
              <PauseCircleFilledIcon className={classes.itemTool} onClick={handlePlay} />
            ) : (
              <PlayCircleFilledOutlinedIcon className={classes.itemTool} onClick={handlePlay} />
            )}

            <FastForwardOutlinedIcon className={classes.itemTool} />
          </Box>
          <Slider className={classes.progress} value={value} onChange={handleChange} aria-labelledby="continuous-slider" />
        </Box>
      </Box>
    </>
  );
}
