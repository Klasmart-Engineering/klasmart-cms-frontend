import { useContext } from "react";
import { StmContext, VideoContext } from "../contexts";

function useVideoState() {
  const { setVideoState: _setState, ...videoState } = useContext(VideoContext);
  const setVideoState = (newVideoState: IVideoState) => {
    _setState &&
      _setState({
        ...videoState,
        ...newVideoState,
      });
  };
  return {
    videoState,
    setVideoState,
  };
}

function usePresentState() {
  const { setRootState: _setState, ...rootState } = useContext(StmContext);
  const { presentState = {} } = rootState;
  const setPresentState = (newPresentState: IPresentState) => {
    _setState &&
      _setState({
        ...rootState,
        presentState: {
          ...presentState,
          ...newPresentState,
        },
      });
  };
  return {
    presentState,
    setPresentState,
  };
}

export { useVideoState, usePresentState };
