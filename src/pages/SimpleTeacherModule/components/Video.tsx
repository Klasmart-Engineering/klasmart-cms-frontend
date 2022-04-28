import React from "react";

const Video = React.forwardRef<HTMLVideoElement, IVideoPlayerProps>((props, ref) => {
  return <video ref={ref} controls={false} autoPlay={true} poster={props.poster} src={`https://res.kidsloop.live/${props.source}`} />;
});

export default Video;
