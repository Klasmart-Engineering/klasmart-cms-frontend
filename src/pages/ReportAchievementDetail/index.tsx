import useQueryCms from "@hooks/useQueryCms";
import { clearNull } from "@utilities/urlUtilities";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { achievementEmpty, emptyTip } from "../../components/TipImages";
import { t } from "../../locale/LocaleManager";
import { getAchievementDetailEmptyStatus } from "../../models/ModelReports";
import { RootState } from "../../reducers";
import { getAchievementDetail } from "../../reducers/report";
import { ReportAchievementList } from "../ReportAchievementList";
import BriefIntroduction from "../ReportAchievementList/BriefIntroduction";
import { ReportTitle } from "../ReportDashboard";
import { AchievementDetailChart } from "./AchievementDetailChart";

const useQuery = () => {
  const { teacher_id, class_id, lesson_plan_id, student_id } = useQueryCms();
  return useMemo(() => {
    return clearNull({ teacher_id, class_id, lesson_plan_id, student_id });
  }, [teacher_id, class_id, lesson_plan_id, student_id]);
};
export function ReportAchievementDetail() {
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();
  const totalData = useSelector<RootState, RootState["report"]>((state) => state.report);
  const achievementDetail = totalData.achievementDetail ?? [];
  const student_name = totalData.student_name;
  const reportMockOptions = totalData.reportMockOptions;
  const backByLessonPlan = (urlParams: string) => {
    history.push({ pathname: ReportAchievementList.routeBasePath, search: urlParams });
  };

  useEffect(() => {
    if (condition.student_id) {
      dispatch(
        getAchievementDetail({
          metaLoading: true,
          id: condition.student_id,
          query: { teacher_id: condition.teacher_id, class_id: condition.class_id, lesson_plan_id: condition.lesson_plan_id },
        })
      );
    }
  }, [condition.class_id, condition.lesson_plan_id, condition.student_id, condition.teacher_id, dispatch]);

  return (
    <>
      <ReportTitle title={t("report_label_individual_achievement")} info={t("report_msg_individual_infor")}></ReportTitle>
      <BriefIntroduction
        value={condition}
        student_name={student_name}
        backByLessonPlan={backByLessonPlan}
        reportMockOptions={reportMockOptions}
      />
      {getAchievementDetailEmptyStatus(achievementDetail) ? (
        achievementEmpty
      ) : achievementDetail && achievementDetail.length > 0 ? (
        <AchievementDetailChart
          data={
            achievementDetail.filter((item) => {
              return item.achieved_items || item.not_achieved_items || item.not_attempted_items;
            }) ?? []
          }
        />
      ) : (
        emptyTip
      )}
    </>
  );
}

ReportAchievementDetail.routeBasePath = "/report/achievement-detail";
ReportAchievementDetail.routeRedirectDefault = `/report/achievement-detail`;
