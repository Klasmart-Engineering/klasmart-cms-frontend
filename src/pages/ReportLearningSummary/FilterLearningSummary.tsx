import { Divider, MenuItem, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
// import produce from "immer";
import React, { ChangeEvent } from "react";
import { IWeeks } from ".";
import { ExternalSubject } from "../../api/api.auto";
import LayoutBox from "../../components/LayoutBox";
import { useRole } from "../../hooks/usePermission";
import { t } from "../../locale/LocaleManager";
import { IResultLearningSummary } from "../../reducers/report";
import { ArrProps, QueryLearningSummaryCondition, QueryLearningSummaryConditionBaseProps } from "./types";
const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  selectButton: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  ".MuiMenu-paper": {
    maxHeight: "300px",
  },
  divider: {
    marginTop: "30px",
  },
}));

export interface LearningSummartOptionsProps {
  year: number[];
  week: IWeeks[];
  subjectList: ExternalSubject[];
}
export interface FilterLearningSummaryProps extends QueryLearningSummaryConditionBaseProps {
  defaultWeeksValue: string;
  summaryReportOptions: IResultLearningSummary;
  onChangeYearFilter: (year: number) => any;
  onChangeWeekFilter: (week_start: number, week_end: number) => any;
  onChangeFilter: (value: string, tab: keyof QueryLearningSummaryCondition) => any;
}
export function FilterLearningSummary(props: FilterLearningSummaryProps) {
  const css = useStyles();
  const { isOrg, isSchool, isTeacher } = useRole();
  const { value, defaultWeeksValue, summaryReportOptions, onChangeYearFilter, onChangeWeekFilter, onChangeFilter } = props;
  const { years, weeks, schools, classes, students, subjects } = summaryReportOptions;
  const getYear = () => {
    return (
      years &&
      years.map((item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))
    );
  };
  const getWeekElement = () => {
    return (
      weeks &&
      weeks.map((item) => (
        <MenuItem key={item.week_start} value={item.value}>
          {item.value}
        </MenuItem>
      ))
    );
  };
  const getInfos = (arr: ArrProps[]) => {
    return (
      arr &&
      arr.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))
    );
  };
  const handleChangeYear = (event: ChangeEvent<HTMLInputElement>) => {
    const year = Number(event.target.value);
    onChangeYearFilter(year);
  };
  const handleChangeWeek = (event: ChangeEvent<HTMLInputElement>) => {
    const week = event.target.value;
    const index = weeks.findIndex((item) => item.value === week);
    const { week_start, week_end } = weeks[index];
    onChangeWeekFilter(week_start, week_end);
  };
  const handleChange = (val: string, tab: keyof QueryLearningSummaryCondition) => {
    onChangeFilter(val, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <div>
        <div>
          {(isOrg || isSchool || isTeacher) && (
            <>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "school_id")}
                label={t("report_filter_school")}
                value={value.school_id}
                select
              >
                {getInfos(schools || [])}
              </TextField>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "class_id")}
                label={t("report_filter_class")}
                value={value.class_id}
                select
              >
                {getInfos(classes || [])}
              </TextField>
              <TextField
                size="small"
                className={css.selectButton}
                onChange={(e) => handleChange(e.target.value, "student_id")}
                label={t("report_filter_student")}
                value={value.student_id}
                select
              >
                {getInfos(students || [])}
              </TextField>
            </>
          )}
          {/* {isStudent && ( */}
          <TextField
            size="small"
            className={css.selectButton}
            onChange={(e) => handleChange(e.target.value, "subject_id")}
            label={t("report_filter_subject")}
            value={value.subject_id}
            select
          >
            {getInfos(subjects || [])}
          </TextField>
          {/* )} */}
        </div>
        <div style={{ marginTop: 20 }}>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeYear}
            label={t("report_filter_year")}
            value={value.year || ""}
            select
          >
            {getYear()}
          </TextField>
          <TextField
            size="small"
            className={css.selectButton}
            onChange={handleChangeWeek}
            label={t("report_filter_week")}
            value={defaultWeeksValue || ""}
            select
          >
            {getWeekElement()}
          </TextField>
        </div>
      </div>
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
