/// <reference path="index.d.ts" />

import "@assets/stm/font/stylesheet.css";
import { CircularProgress } from "@material-ui/core";
import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import { intialState, intialVideoState, StmContext, VideoContext } from "./contexts";

const PresentActivity = React.lazy(() => import("./PresentActivity"));
const SelectClassLevel = React.lazy(() => import("./SelectClassLevel"));
const SelectCurriculum = React.lazy(() => import("./SelectCurriculum"));
const SelectLesson = React.lazy(() => import("./SelectLesson"));

enum pageLinks {
  curriculum = "/stm/curriculum",
  lesson = "/stm/lesson",
  level = "/stm/level",
  present = "/stm/present",
}

export default function Stm() {
  const [rootState, setRootState] = React.useState<IContextState>(intialState);
  const [videoState, setVideoState] = React.useState<IVideoState>(intialVideoState);
  const { step } = useParams<{ step: string }>();

  return process.env.NODE_ENV === "production" ? null : (
    <StmContext.Provider
      value={{
        ...rootState,
        setRootState,
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        {step === "curriculum" && <SelectCurriculum />}
        {step === "lesson" && <SelectLesson />}
        {step === "level" && <SelectClassLevel />}
        {step === "present" && (
          <VideoContext.Provider
            value={{
              ...videoState,
              setVideoState,
            }}
          >
            <PresentActivity />
          </VideoContext.Provider>
        )}
      </Suspense>
    </StmContext.Provider>
  );
}

Stm.routeMatchPath = "/stm/:step";

export { pageLinks };
