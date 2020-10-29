import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { RootState } from "../../reducers";
import { getContentDetailById } from "../../reducers/content";
import { getAchievementDetail, getMockOptions } from "../../reducers/report";
import { ReportAchievementList } from "../ReportAchievementList";
import BriefIntroduction from "../ReportAchievementList/BriefIntroduction";
import FirstSearchHeader, { Category, FirstSearchHeaderMb, FirstSearchHeaderProps } from "../ReportAchievementList/FirstSearchHeader";
import { ReportCategories } from "../ReportCategories";
import { AchievementDetailChart } from "./AchievementDetailChart";

const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const teacher_id = query.get("teacher_id") || "";
    const class_id = query.get("class_id") || "";
    const lesson_plan_id = query.get("lesson_plan_id") || "";
    const student_id = query.get("student_id") || "";
    return clearNull({ teacher_id, class_id, lesson_plan_id, student_id });
  }, [search]);
};

export function ReportAchievementDetail() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const { mockOptions, achievementDetail = [] } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const handleChange: FirstSearchHeaderProps["onChange"] = (value) => {
    if (value === Category.archived) return;
    if (value === Category.learningOutcomes) history.push(ReportCategories.routeBasePath);
  };
  const backByLessonPlan = (urlParams: string) => {
    history.push({ pathname: ReportAchievementList.routeBasePath, search: urlParams });
  };
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);

  useEffect(() => {
    if (condition.lesson_plan_id) {
      dispatch(getContentDetailById({ metaLoading: true, content_id: condition.lesson_plan_id }));
    }
  }, [condition.lesson_plan_id, dispatch]);

  useEffect(() => {
    dispatch(getMockOptions());
  }, [dispatch]);

  useEffect(() => {
    if (condition.student_id) {
      dispatch(
        getAchievementDetail({
          id: condition.student_id,
          query: { teacher_id: condition.teacher_id, class_id: condition.class_id, lesson_plan_id: condition.lesson_plan_id },
        })
      );
    }
  }, [condition.class_id, condition.lesson_plan_id, condition.student_id, condition.teacher_id, dispatch]);

  return (
    <>
      <FirstSearchHeader value={Category.archived} onChange={handleChange} />
      <FirstSearchHeaderMb value={Category.archived} onChange={handleChange} />
      <BriefIntroduction value={condition} mockOptions={mockOptions} contentPreview={contentPreview} backByLessonPlan={backByLessonPlan} />
      {achievementDetail && <AchievementDetailChart data={achievementDetail} />}
    </>
  );
}

ReportAchievementDetail.routeBasePath = "/report/achievement-detail";
ReportAchievementDetail.routeRedirectDefault = `/report/achievement-detail`;
