/// <reference path="index.d.ts" />

import { useParams } from "react-router-dom";
import PresentActivity from "./PresentActivity";
import SelectClassLevel from "./SelectClassLevel";
import SelectCurriculum from "./SelectCurriculum";
import SelectLesson from "./SelectLesson";

export default function InClass() {
  const { step } = useParams<{ step: string }>();

  return (
    <div>
      {step === "curriculum" && <SelectCurriculum />}
      {step === "lesson" && <SelectLesson />}
      {step === "level" && <SelectClassLevel />}
      {step === "present" && <PresentActivity />}
    </div>
  );
}

InClass.routeMatchPath = "/inclass/:step";
