import React from "react";

const Video = React.forwardRef<HTMLVideoElement, IVideoPlayerProps>((props, ref) => {
  return <video ref={ref} controls={true} autoPlay={true} src={`https://res.kidsloop.live/${props.source}`} />;
});

export default Video;
