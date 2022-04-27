import React from "react";

const intialState: IContextState = {};

const intialVideoState: IVideoState = {};

const StmContext = React.createContext<
  IContextState & {
    setRootState?: (state: IContextState) => void;
  }
>(intialState);

const VideoContext = React.createContext<
  IVideoState & {
    setVideoState?: (state: IVideoState) => void;
  }
>(intialVideoState);
export { intialState, intialVideoState, StmContext, VideoContext };
