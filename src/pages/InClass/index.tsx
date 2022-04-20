/// <reference path="index.d.ts" />

import "@assets/inclass/webfontkit-20220420-034701/stylesheet.css";
import { CircularProgress } from "@material-ui/core";
import React, { Suspense } from "react";
import { useParams } from "react-router-dom";

const PresentActivity = React.lazy(() => import("./PresentActivity"));
const SelectClassLevel = React.lazy(() => import("./SelectClassLevel"));
const SelectCurriculum = React.lazy(() => import("./SelectCurriculum"));
const SelectLesson = React.lazy(() => import("./SelectLesson"));

enum pageLinks {
  curriculum = "/inclass/curriculum",
  lesson = "/inclass/lesson",
  level = "/inclass/level",
  present = "/inclass/present",
}

const intialState: IContextState = {};

const Context = React.createContext<
  IContextState & {
    setRootState?: (state: IContextState) => void;
  }
>({
  ...intialState,
});

export default function InClass() {
  const [rootState, setRootState] = React.useState<IContextState>(intialState);
  const { step } = useParams<{ step: string }>();

  return (
    <Context.Provider
      value={{
        ...rootState,
        setRootState,
      }}
    >
      <Suspense fallback={<CircularProgress />}>
        {step === "curriculum" && <SelectCurriculum />}
        {step === "lesson" && <SelectLesson />}
        {step === "level" && <SelectClassLevel />}
        {step === "present" && <PresentActivity />}
      </Suspense>
    </Context.Provider>
  );
}

InClass.routeMatchPath = "/inclass/:step";

export { Context as InClassContext, pageLinks };
