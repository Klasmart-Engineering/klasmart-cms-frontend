import { Box, makeStyles } from "@material-ui/core";
import React from "react";
import PresentPlayer from "./components/Player";
import PresentList from "./components/PresentList";
import PresentNav from "./components/PresentNav";
import { geLessonMaterials } from "./utils/api";
import emitter from "./utils/event";

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
  const [state, setState] = React.useState<IPresentActivityState>({
    activeIndex: 0,
    lessonMaterials: [],
  });
  const handleCmd = (cmd: any) => {
    setState((state) => {
      let activeIndex = state.activeIndex;
      if (cmd === "prev") {
        activeIndex = Math.max(0, state.activeIndex - 1);
      }
      if (cmd === "next") {
        activeIndex = Math.min(state.lessonMaterials.length - 1, state.activeIndex + 1);
      }
      return {
        ...state,
        activeIndex,
      };
    });
  };
  React.useEffect(() => {
    geLessonMaterials("plan0102").then((data: IListItem[]) => {
      setState((state) => ({
        ...state,
        lessonMaterials: data,
      }));
    });
    emitter.on("cmd", handleCmd);
    return () => emitter.off("cmd", handleCmd);
  }, []);

  const [name, data] = React.useMemo(() => {
    if (state.lessonMaterials.length > 0) {
      const activeItem = state.lessonMaterials[state.activeIndex];
      return [activeItem.name, JSON.parse(activeItem.data)];
    }
    return ["", {}];
  }, [state.lessonMaterials, state.activeIndex]);
  return (
    <Box className={css.root}>
      <PresentNav />
      <PresentList
        activeIndex={state.activeIndex}
        list={state.lessonMaterials}
        onClick={(index) => {
          setState({
            ...state,
            activeIndex: index,
          });
        }}
      />
      <PresentPlayer data={data} name={name} lessonNo={1} progress={`${state.activeIndex + 1}/${state.lessonMaterials.length}`} />
    </Box>
  );
}
