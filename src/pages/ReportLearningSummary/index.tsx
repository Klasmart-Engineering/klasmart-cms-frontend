/* eslint-disable react-hooks/exhaustive-deps */
import useQueryCms from "@hooks/useQueryCms";
import { clearNull } from "@utilities/urlUtilities";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { useRole } from "../../hooks/usePermission";
import { t } from "../../locale/LocaleManager";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { RootState } from "../../reducers";
import {
  getAfterClassFilter,
  getAssignmentSummary,
  getLiveClassesSummary,
  onLoadLearningSummary,
  resetSummaryOptions,
} from "../../reducers/report";
import { ReportTitle } from "../ReportDashboard";
import { FilterLearningSummary, FilterLearningSummaryProps } from "./FilterLearningSummary";
import { ReportInfo } from "./ReportInfo";
import { QueryLearningSummaryCondition, QueryLearningSummaryTimeFilterCondition, ReportType } from "./types";
export interface IWeeks {
  week_start: number;
  week_end: number;
  value: string;
}
interface RouteParams {
  tab: QueryLearningSummaryTimeFilterCondition["summary_type"];
}

export const useQuery = (): QueryLearningSummaryCondition => {
  const { querys, year, week_start, week_end, school_id, class_id, student_id, subject_id } = useQueryCms();
  const idx = Number(querys.get("lessonIndex"));
  const lessonIndex = idx >= 0 ? idx : -1;
  return useMemo(() => {
    return { year, week_start, week_end, school_id, class_id, student_id, subject_id, lessonIndex };
  }, [year, week_start, week_end, school_id, class_id, student_id, subject_id, lessonIndex]);
};
export function ReportLearningSummary() {
  const dispatch = useDispatch();
  const { routeBasePath } = ReportLearningSummary;
  const condition = useQuery();
  const { lessonIndex, year, week_start, week_end, school_id, class_id, student_id, subject_id } = condition;
  const history = useHistory();
  const { tab } = useParams<RouteParams>();
  // const isLiveClass = tab === ReportType.live
  const { liveClassSummary, assignmentSummary, summaryReportOptions } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const { isOrg, isSchool, isTeacher, isStudent } = useRole();
  const { weeks } = summaryReportOptions;
  const defaultWeeksValue = useMemo(() => {
    if (weeks.length && condition.week_start) {
      const index = weeks.findIndex((item) => item.week_start === Number(condition.week_start));
      return weeks && weeks[index] ? `${weeks[index].value}` : weeks[0].value;
    }
  }, [condition.week_start, weeks]);
  const handleChange = (value: QueryLearningSummaryCondition) => {
    const newValue = { ...value, lessonIndex: -1 };
    history.replace({ search: toQueryString(clearNull(newValue)) });
  };

  const handleChangeWeekFilter: FilterLearningSummaryProps["onChangeWeekFilter"] = (week_start, week_end) => {
    dispatch(
      onLoadLearningSummary({
        summary_type: tab,
        year,
        week_start,
        week_end,
        school_id,
        class_id,
        student_id,
        subject_id,
        metaLoading: true,
      })
    );
  };
  const handleChangeYearFilter: FilterLearningSummaryProps["onChangeYearFilter"] = (year) => {
    dispatch(resetSummaryOptions({ year }));
    dispatch(
      onLoadLearningSummary({
        summary_type: tab,
        year,
        week_start: 0,
        week_end: 0,
        school_id,
        class_id,
        student_id,
        subject_id,
        metaLoading: true,
      })
    );
  };
  const handleChangeFilter: FilterLearningSummaryProps["onChangeFilter"] = (value, tab) => {
    computeFilterChange(value, tab);
  };
  const filterParams = { summary_type: tab, week_end, week_start, isOrg, isSchool, isTeacher, isStudent, metaLoading: true };
  const summaryParams = useMemo(() => {
    return { year, week_start, week_end, school_id };
  }, [school_id, week_end, week_start, year]);
  const changeSchoolFilter = useMemo(
    () => async (school_id: string) => {
      await dispatch(getAfterClassFilter({ filter_type: "class", school_id, ...filterParams, metaLoading: true }));
    },
    [dispatch, filterParams]
  );
  const changeClassFilter = useMemo(
    () => async (class_id: string) => {
      await dispatch(getAfterClassFilter({ filter_type: "student", school_id, class_id, ...filterParams, metaLoading: true }));
    },
    [dispatch, filterParams, school_id]
  );
  const changeStudent = useMemo(
    () => async (student_id: string) => {
      await dispatch(
        getAfterClassFilter({
          school_id,
          class_id,
          student_id,
          filter_type: "subject",
          ...filterParams,
          metaLoading: true,
        })
      );
    },
    [class_id, dispatch, filterParams, school_id]
  );
  const changeSubject = useMemo(
    () => async (subject_id: string) => {
      history.push({ search: setQuery(history.location.search, { subject_id, lessonIndex: -1 }) });
      dispatch(
        getLiveClassesSummary({
          ...summaryParams,
          class_id,
          student_id,
          subject_id,
          metaLoading: true,
        })
      );
      dispatch(getAssignmentSummary({ ...summaryParams, class_id, student_id, subject_id, metaLoading: true }));
    },
    [class_id, dispatch, history, student_id, summaryParams]
  );
  const computeFilterChange = useMemo(
    () => (value: string, filter: keyof QueryLearningSummaryCondition) => {
      if (filter === "school_id") {
        history.push({
          search: setQuery(history.location.search, { school_id: value, class_id: "", student_id: "", subject_id: "" }),
        });
        changeSchoolFilter(value);
      }
      if (filter === "class_id") {
        changeClassFilter(value);
      }
      if (filter === "student_id") {
        changeStudent(value);
      }
      if (filter === "subject_id") {
        changeSubject(value);
      }
    },
    [changeClassFilter, changeSchoolFilter, changeStudent, changeSubject, history]
  );
  const handleChangeReportType = useMemo(
    () => async (value: ReportType) => {
      if (value === tab) return;
      history.replace({ pathname: `${routeBasePath}/tab/${value}`, search: setQuery(history.location.search, { lessonIndex: -1 }) });
    },
    [history, routeBasePath, tab]
  );
  const handleChangeLessonIndex = (index: number) => {
    history.replace({ search: setQuery(history.location.search, { lessonIndex: index }) });
  };
  useEffect(() => {
    dispatch(
      onLoadLearningSummary({
        summary_type: tab,
        year,
        week_start,
        week_end,
        school_id,
        class_id,
        student_id,
        subject_id,
        metaLoading: true,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);
  useEffect(() => {
    if (summaryReportOptions.week_start) {
      const {
        year = "",
        week_start = "",
        week_end = "",
        school_id = "",
        class_id = "",
        student_id = "",
        subject_id = "",
      } = summaryReportOptions;
      history.push({
        search: setQuery(history.location.search, {
          year,
          week_start,
          week_end,
          school_id,
          class_id,
          student_id,
          subject_id,
          lessonIndex: -1,
        }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, summaryReportOptions]);
  return (
    <>
      <ReportTitle title={t("report_learning_summary_report")} info={t("report_msg_lsr")} />
      <FilterLearningSummary
        value={condition}
        defaultWeeksValue={defaultWeeksValue as string}
        onChange={handleChange}
        onChangeFilter={handleChangeFilter}
        summaryReportOptions={summaryReportOptions}
        onChangeWeekFilter={handleChangeWeekFilter}
        onChangeYearFilter={handleChangeYearFilter}
      />
      <ReportInfo
        lessonIndex={lessonIndex!}
        reportType={tab}
        onChangeReportType={handleChangeReportType}
        liveClassSummary={liveClassSummary}
        assignmentSummary={assignmentSummary}
        onChangeLessonIndex={handleChangeLessonIndex}
      />
    </>
  );
}
ReportLearningSummary.routeBasePath = "/report/learning-summary";
ReportLearningSummary.routeMatchPath = `/report/learning-summary/tab/:tab`;
ReportLearningSummary.routeRedirectDefault = `/report/learning-summary/tab/${ReportType.live}?lessonIndex=-1`;
