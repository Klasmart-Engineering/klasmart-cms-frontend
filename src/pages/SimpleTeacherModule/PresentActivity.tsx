import { Box, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import PresentPlayer from "./components/Player";
import PresentList from "./components/PresentList";
import PresentNav from "./components/PresentNav";
import { StmContext } from "./contexts";
import { usePresentState, useVideoState } from "./hooks/rootState";
import { geLessonMaterials } from "./utils/api";

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
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { planId, curriculum, classLevel, lessonId } = useContext(StmContext);
  const { presentState, setPresentState } = usePresentState();
  const { setVideoState } = useVideoState();
  const { activeIndex = 0, isFullscreen = false } = presentState;
  const [lessonMaterials, setLessonMaterials] = React.useState<IListItem[]>([]);

  React.useEffect(() => {
    const params: {} = { curriculum, classLevel };
    if (planId) {
      geLessonMaterials(planId, params).then((data: IListItem[]) => {
        setLessonMaterials(data);
        setPresentState({
          activeIndex: 0,
          listLength: data.length,
          isFullscreen: false,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, curriculum, classLevel]);

  const [name, thumbnail, data] = React.useMemo(() => {
    if (lessonMaterials.length > 0) {
      const activeItem = lessonMaterials[activeIndex];
      console.log(activeItem);
      return [activeItem.name, activeItem.thumbnail, JSON.parse(activeItem.data)];
    }
    return ["", "", {}];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonMaterials, activeIndex]);

  React.useEffect(() => {
    const isMedia = data.file_type === 2 || data.file_type === 3;
    setVideoState({
      isMedia,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.file_type]);

  return (
    <Box className={css.root}>
      <PresentNav videoRef={videoRef as React.RefObject<HTMLVideoElement>} />
      {!isFullscreen && <PresentList list={lessonMaterials} />}
      <PresentPlayer ref={videoRef} data={data} name={name} thumbnail={thumbnail} lessonNo={lessonId} />
    </Box>
  );
}
