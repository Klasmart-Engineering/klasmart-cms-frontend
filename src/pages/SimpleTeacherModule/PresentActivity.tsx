import { Box, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import PresentPlayer from "./components/Player";
import PresentList from "./components/PresentList";
import PresentNav from "./components/PresentNav";
import { StmContext } from "./index";
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
  const { setRootState, ...rootState } = useContext(StmContext);
  const { planId, curriculum, classLevel, presentState } = rootState;
  const { activeIndex = 0, isFullscreen = false } = presentState || {};
  const [lessonMaterials, setLessonMaterials] = React.useState<IListItem[]>([]);

  React.useEffect(() => {
    const params: {} = { curriculum, classLevel };
    planId &&
      geLessonMaterials(planId, params).then((data: IListItem[]) => {
        setLessonMaterials(data);
        setRootState &&
          setRootState({
            ...rootState,
            presentState: {
              ...presentState,
              activeIndex: 0,
              listLength: data.length,
              isFullscreen: false,
            },
          });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, curriculum, classLevel]);

  const [name, data] = React.useMemo(() => {
    if (lessonMaterials.length > 0) {
      const activeItem = lessonMaterials[activeIndex];
      return [activeItem.name, JSON.parse(activeItem.data)];
    }
    return ["", {}];
  }, [lessonMaterials, activeIndex]);

  return (
    <Box className={css.root}>
      <PresentNav />
      {!isFullscreen && <PresentList list={lessonMaterials} />}
      <PresentPlayer data={data} name={name} lessonNo={1} progress={`${activeIndex + 1} / ${lessonMaterials.length}`} />
    </Box>
  );
}
