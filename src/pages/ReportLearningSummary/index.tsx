import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { PermissionType, usePermission } from "../../components/Permission";
import { t } from "../../locale/LocaleManager";
import { setQuery, toQueryString } from "../../models/ModelContentDetailForm";
import { formatTimeToMonDay } from "../../models/ModelReports";
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
import { QueryLearningSummaryCondition, QueryLearningSummaryRemainingFilterCondition, ReportType } from "./types";
export interface IWeeks {
  week_start: number;
  week_end: number;
  value: string;
}
interface RouteParams {
  tab: QueryLearningSummaryRemainingFilterCondition["summary_type"];
}
export const getWeeks = (): IWeeks[] => {
  let week_start = new Date("2021-01-04 00:00").getTime() / 1000;
  const currentTime = new Date().getTime() / 1000;
  let week_end = week_start + 7 * 24 * 60 * 60 - 1;
  const weeks: IWeeks[] = [];
  while (week_end < currentTime) {
    const item = `${formatTimeToMonDay(week_start)}~${formatTimeToMonDay(week_end)}`;
    weeks.push({ week_start, week_end, value: item });
    week_start = week_end + 1;
    week_end = week_start + 7 * 24 * 60 * 60 - 1;
  }
  return weeks;
};
const clearNull = (obj: Record<string, any>) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) delete obj[key];
  });
  return obj;
};

export const useQuery = (): QueryLearningSummaryCondition => {
  const { search } = useLocation();
  return useMemo(() => {
    const query = new URLSearchParams(search);
    const year = Number(query.get("year"));
    const week_start = Number(query.get("week_start"));
    const week_end = Number(query.get("week_end"));
    const school_id = query.get("school_id") || "";
    const class_id = query.get("class_id") || "";
    const teacher_id = query.get("teacher_id") || "";
    const student_id = query.get("student_id") || "";
    const subject_id = query.get("subject_id") || "";
    const idx = Number(query.get("lessonIndex"));
    const lessonIndex = idx >= 0 ? idx : -1;
    return { year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id, lessonIndex };
  }, [search]);
};
export function ReportLearningSummary() {
  const dispatch = useDispatch();
  const { routeBasePath } = ReportLearningSummary;
  const condition = useQuery();
  const { lessonIndex, year, week_start, week_end, school_id, class_id, teacher_id, student_id, subject_id } = condition;
  const history = useHistory();
  const { tab } = useParams<RouteParams>();
  // const isLiveClass = tab === ReportType.live
  const { liveClassSummary, assignmentSummary, summaryReportOptions } = useSelector<RootState, RootState["report"]>(
    (state) => state.report
  );
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
  ]);
  const isOrg = perm.report_learning_summary_org_652 as boolean;
  const isSchool = perm.report_learning_summary_school_651 as boolean;
  const isTeacher = perm.report_learning_summary_teacher_650 as boolean;
  const isStudent = perm.report_learning_summary_student_649 as boolean;
  const { weeks } = summaryReportOptions;
  const defaultWeeksValue = useMemo(() => {
    if (weeks.length && condition.week_start) {
      const index = weeks.findIndex((item) => item.week_start === Number(condition.week_start));
      return weeks && weeks[index] ? `${weeks[index].value}` : weeks[weeks.length - 1].value;
    }
  }, [condition.week_start, weeks]);
  const handleChange = (value: QueryLearningSummaryCondition) => {
    const newValue = { ...value, lessonIndex: -1 };
    history.replace({ search: toQueryString(clearNull(newValue)) });
  };

  const handleChangeWeekFilter: FilterLearningSummaryProps["onChangeWeekFilter"] = (week_start, week_end) => {
    dispatch(resetSummaryOptions({ week_start, week_end }));
    dispatch(
      onLoadLearningSummary({
        summary_type: tab,
        year,
        week_start,
        week_end,
        school_id: "",
        class_id: "",
        teacher_id: "",
        student_id: "",
        subject_id: "",
        metaLoading: true,
      })
    );
  };
  const handleChangeYearFilter: FilterLearningSummaryProps["onChangeYearFilter"] = (year) => {
    dispatch(resetSummaryOptions({ year, years: [], weeks: [], week_start: 0, week_end: 0 }));
    dispatch(onLoadLearningSummary({ summary_type: tab, year, metaLoading: true }));
    history.replace(`${routeBasePath}/tab/${tab}?lessonIndex=-1&year=${year}`);
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
      await dispatch(getAfterClassFilter({ filter_type: "class", school_id, ...filterParams }));
    },
    [dispatch, filterParams]
  );
  const changeClassFilter = useMemo(
    () => async (class_id: string) => {
      if (isOrg || isSchool) {
        await dispatch(getAfterClassFilter({ filter_type: "teacher", school_id, class_id, ...filterParams }));
      } else if (isTeacher) {
        await dispatch(getAfterClassFilter({ class_id, filter_type: "student", ...filterParams }));
      }
    },
    [dispatch, filterParams, isOrg, isSchool, isTeacher, school_id]
  );
  const changeTeacher = useMemo(
    () => async (teacher_id: string) => {
      await dispatch(
        getAfterClassFilter({
          filter_type: "student",
          school_id,
          class_id,
          teacher_id,
          ...filterParams,
        })
      );
    },
    [class_id, dispatch, filterParams, school_id]
  );
  const changeStudent = useMemo(
    () => async (student_id: string) => {
      await dispatch(
        getAfterClassFilter({
          school_id,
          class_id,
          teacher_id,
          student_id,
          filter_type: "subject",
          ...filterParams,
          metaLoading: true,
        })
      );
    },
    [class_id, dispatch, filterParams, school_id, teacher_id]
  );
  const changeSubject = useMemo(
    () => async (subject_id: string) => {
      history.push({ search: setQuery(history.location.search, { subject_id, lessonIndex: -1 }) });
      tab === ReportType.live
        ? dispatch(
            getLiveClassesSummary({
              ...summaryParams,
              class_id,
              teacher_id,
              student_id,
              subject_id,
              metaLoading: true,
            })
          )
        : dispatch(getAssignmentSummary({ ...summaryParams, class_id, teacher_id, student_id, subject_id, metaLoading: true }));
    },
    [class_id, dispatch, history, student_id, summaryParams, tab, teacher_id]
  );
  const computeFilterChange = useMemo(
    () => (value: string, filter: keyof QueryLearningSummaryCondition) => {
      if (filter === "school_id") {
        history.push({
          search: setQuery(history.location.search, { school_id: value, class_id: "", teacher_id: "", student_id: "", subject_id: "" }),
        });
        changeSchoolFilter(value);
      }
      if (filter === "class_id") {
        changeClassFilter(value);
      }
      if (filter === "teacher_id") {
        changeTeacher(value);
      }
      if (filter === "student_id") {
        changeStudent(value);
      }
      if (filter === "subject_id") {
        changeSubject(value);
      }
    },
    [changeClassFilter, changeSchoolFilter, changeStudent, changeSubject, changeTeacher, history]
  );
  const handleChangeReportType = useMemo(
    () => async (value: ReportType) => {
      if (value === tab) return;
      await dispatch(resetSummaryOptions({ years: [], weeks: [], week_start: 0, week_end: 0 }));
      dispatch(onLoadLearningSummary({ summary_type: value, metaLoading: true }));
      history.replace(`${routeBasePath}/tab/${value}?lessonIndex=-1`);
    },
    [dispatch, history, routeBasePath, tab]
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
        teacher_id,
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
        teacher_id = "",
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
          teacher_id,
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