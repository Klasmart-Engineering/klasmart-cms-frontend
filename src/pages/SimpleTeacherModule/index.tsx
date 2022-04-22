/// <reference path="index.d.ts" />

import "@assets/stm/font/stylesheet.css";
import { CircularProgress } from "@material-ui/core";
import React, { Suspense } from "react";
import { useParams } from "react-router-dom";

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

const intialState: IContextState = {};

const Context = React.createContext<
  IContextState & {
    setRootState?: (state: IContextState) => void;
  }
>({
  ...intialState,
});

export default function Stm() {
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

Stm.routeMatchPath = "/stm/:step";

export { Context as StmContext, pageLinks };
