import moment from "moment";
import { ReactNode } from "react";
import { Class, School, User } from "../api/api-ko-schema.auto";
import {
  EntityClassesAssignmentsUnattendedStudentsView,
  EntityReportListTeachingLoadItem,
  EntityStudentAchievementReportCategoryItem,
} from "../api/api.auto";
import { HorizontalBarStackDataItem } from "../components/Chart/HorizontalBarStackChart";
import { d, t } from "../locale/LocaleManager";
import { UserType } from "../pages/ReportLearningSummary/types";
import { teacherLoadDescription } from "../pages/ReportTeachingLoad/components/TeacherLoadChart";
import { Iitem } from "../reducers/report";
interface formatTeachingLoadListResponse {
  formatedData: HorizontalBarStackDataItem[];
  xLabels?: string[][];
}

export const ModelReport = {
  teacherListSetDiff(teacherList: Pick<User, "user_id" | "user_name">[]): Pick<User, "user_id" | "user_name">[] {
    let hash: Record<string, boolean> = {};
    teacherList = teacherList.reduce((preVal: Pick<User, "user_id" | "user_name">[], curVal) => {
      if (!hash[curVal.user_id]) {
        hash[curVal.user_id] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
    return teacherList;
  },
  ListSetDiff(list: Iitem[]): Iitem[] {
    let hash: Record<string, boolean> = {};
    list = list.reduce((preVal: Iitem[], curVal) => {
      if (curVal?.value && !hash[curVal?.value]) {
        hash[curVal?.value] = true;
        preVal.push(curVal);
      }
      return preVal;
    }, []);
    return list;
  },
};

export function formatTime(seconds: number | undefined) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const second = date.getSeconds();
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}  ${hour.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
}
enum formatTimeToMonWekType {
  hasTh = "hasTh",
}
export function formatTimeToMonWek(seconds: number, type?: string) {
  const date = new Date(seconds * 1000);
  const monthArr = [
    d("Jan").t("schedule_calendar_jan"),
    d("Feb").t("schedule_calendar_feb"),
    d("Mar").t("schedule_calendar_mar"),
    d("Apr").t("schedule_calendar_apr"),
    d("May").t("schedule_calendar_may"),
    d("Jun").t("schedule_calendar_jun"),
    d("Jul").t("schedule_calendar_jul"),
    d("Aug").t("schedule_calendar_aug"),
    d("Sep").t("schedule_calendar_sep"),
    d("Oct").t("schedule_calendar_oct"),
    d("Nov").t("schedule_calendar_nov"),
    d("Dec").t("schedule_calendar_dec"),
  ];
  // const weekArr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekFullNameArr = [
    d("Sunday").t("schedule_frequency_sunday"),
    d("Monday").t("schedule_frequency_monday"),
    d("Tuesday").t("schedule_frequency_tuesday"),
    d("Wednesday").t("schedule_frequency_wednesday"),
    d("Thursday").t("schedule_frequency_thursday"),
    d("Friday").t("schedule_frequency_friday"),
    d("Saturday").t("schedule_frequency_saturday"),
  ];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  // const week = weekArr[date.getDay()];
  const weekFullName = weekFullNameArr[date.getDay()];
  if (type === formatTimeToMonWekType.hasTh) {
    return `${month} ${day}th,${weekFullName}`;
  }
  return `${month}  ${day},  ${weekFullName}`;
}

enum Type {
  date = "date",
  time = "time",
}
export function formatTimeToEng(seconds: number, type?: string) {
  if (!seconds) return "";
  const date = new Date(seconds * 1000);
  const year = date.getFullYear();
  const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Spt", "Oct", "Nov", "Dec"];
  const month = monthArr[date.getMonth()];
  const day = date.getDate();
  const h = date.getHours();
  const dayType = h > 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h;
  const min = date.getMinutes();
  if (type === Type.date) {
    return `${month}  ${day},  ${year}`;
  }
  if (type === Type.time) {
    return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")} ${dayType}`;
  }
}

export function formatTimeToHourMin(seconds: number) {
  const date = new Date(seconds * 1000);
  const hour = date.getHours();
  const min = date.getMinutes();
  return `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
}
export function formatTimeToMonDay(seconds: number) {
  const date = new Date(seconds * 1000);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}`;
}

interface Time2colorLevelResponse {
  color: string;
  hour: number;
  min: number;
}
export function time2colorLevel(seconds: number): Time2colorLevelResponse {
  if (seconds === 0) return { color: "rgba(174,174,174,0.15)", hour: 0, min: 0 };
  const hour = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  let color = "rgba(0,98,255,1)";
  if (hour < 2) {
    color = "rgba(230,239,255,1)";
  } else if (hour < 4) {
    color = "rgba(163,199,255,1)";
  } else if (hour < 6) {
    color = "rgba(74,144,255,1)";
  }
  return { color, hour, min };
}
export function formatTeachingLoadList(data: EntityReportListTeachingLoadItem[]): formatTeachingLoadListResponse {
  let formatedData: HorizontalBarStackDataItem[] = [];
  formatedData = data.map((dataItem) => {
    return {
      id: dataItem.teacher_id || "",
      name: dataItem.teacher_name || "",
      description: "",
      value: dataItem.durations
        ? dataItem.durations.map((durationItems, idx) => {
            const total = (durationItems?.online || 0) + (durationItems?.offline || 0);
            const { color } = time2colorLevel(total);
            const description: ReactNode = teacherLoadDescription({ ...durationItems });
            return {
              name: `category-${idx}`,
              value: 10,
              color,
              description: description,
            };
          })
        : [],
    };
  });
  const xLabels = data[0].durations?.map((items) => {
    return formatTimeToMonWek && formatTimeToMonWek(items.end_at || 0, formatTimeToMonWekType.hasTh).split(",");
  });
  return { formatedData, xLabels };
}

export function getAchievementDetailEmptyStatus(data: EntityStudentAchievementReportCategoryItem[]): boolean {
  return data && data.length ? data.every((item) => !item.achieved_items && !item.not_achieved_items && !item.not_attempted_items) : false;
}

export function deDuplicate(arr: Pick<User, "user_id" | "user_name">[]) {
  let obj: { [key: string]: boolean } = {};
  return arr.reduce<Pick<User, "user_id" | "user_name">[]>((item, next) => {
    if (!obj[next.user_id]) {
      item.push(next);
      obj[next.user_id] = true;
    }
    return item;
  }, []);
}

export function getTimeOffSecond() {
  const timeOff = new Date().getTimezoneOffset();
  return -timeOff * 60;
}
type studentItem = Pick<User, "user_id" | "user_name">;

// @ts-ignore
export interface IClassesAssignmentsUnattendedWithStudentNameItem extends EntityClassesAssignmentsUnattendedStudentsView {
  student_name?: studentItem["user_name"];
}

export const getClassesAssignmentsUnattendedWithStudentName = (
  classesAssignmentsUnattended: EntityClassesAssignmentsUnattendedStudentsView[],
  studentList?: studentItem[]
): IClassesAssignmentsUnattendedWithStudentNameItem[] => {
  return classesAssignmentsUnattended.map((item) => {
    const student_name = studentList?.find((student) => student.user_id === item.student_id)?.user_name;
    return { ...item, student_name };
  });
};
export function sortByStudentName(studentName: any) {
  return function (x: any, y: any) {
    let reg = /[a-zA-Z0-9]/;
    if (reg.test(x[studentName]) || reg.test(y[studentName])) {
      if (x[studentName].toLowerCase() > y[studentName].toLowerCase()) {
        return 1;
      } else if (x[studentName].toLowerCase() < y[studentName].toLowerCase()) {
        return -1;
      } else {
        return 0;
      }
    } else {
      return x[studentName].localeCompare(y[studentName], "zh");
    }
  };
}
export function getTimeDots(): ILatestThreeMonths {
  const currentDate = new Date();
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  switch (month) {
    case 1:
      year--;
      return {
        latestThreeMonthsDate: [11, 12, 1],
        latestThreeMonthsDots: [`${year}/11/01 00:00:00`, `${year}/12/01 00:00:00`, `${year + 1}/01/01 00:00:00`],
      };
    case 2:
      year--;
      return {
        latestThreeMonthsDate: [12, 1, 2],
        latestThreeMonthsDots: [`${year}/12/01 00:00:00`, `${year}/01/01 00:00:00`, `${year + 1}/02/01 00:00:00`],
      };
    default:
      return {
        latestThreeMonthsDate: [parseInt(`${month - 2}`), parseInt(`${month - 1}`), parseInt(`${month}`)],
        latestThreeMonthsDots: [`${year}/${month - 2}/01 00:00:00`, `${year}/${month - 1}/01 00:00:00`, `${year}/${month}/01 00:00:00`],
      };
  }
}
export interface ILatestThreeMonths {
  latestThreeMonthsDate: number[];
  latestThreeMonthsDots: string[];
}

export function getAllUsers(
  schools: Pick<School, "classes" | "school_id" | "school_name">[],
  noneSchoolClasses: Pick<Class, "class_id" | "class_name" | "schools" | "students">[],
  isSchool: boolean
) {
  let freedomClass: UserType["classes"] = [];
  let allClasses: UserType["classes"] = [];
  let allStudents: UserType["classes"][0]["students"] = [];
  let noSchoolAllStudents: UserType["classes"][0]["students"] = [];
  // 无学校班级
  freedomClass = noneSchoolClasses.map((item) => ({
    id: item.class_id!,
    name: item.class_name!,
    students:
      item.students?.map((item) => ({
        id: item?.user_id!,
        name: item?.user_name!,
      })) || [],
  }));

  // let allStu: any = [];
  // noneSchoolClasses.map(item => allStu.push(item.students?.map((item) => ({
  //   id: item?.user_id!,
  //   name: item?.user_name!,
  // })) || []))
  // freedomClass.unshift({ id: "all", name: d("All").t("report_label_all"), students: allStu});
  // console.log("freedomClass", freedomClass);
  freedomClass.forEach((item) => {
    noSchoolAllStudents = [...noSchoolAllStudents, ...item.students];
  });
  freedomClass = [{ id: "all", name: d("All").t("report_label_all"), students: [...noSchoolAllStudents] }, ...freedomClass];
  // 所有学校
  const allSchools = schools.map((item) => ({
    id: item.school_id!,
    name: item.school_name!,
    classes:
      item.classes?.map((item) => ({
        id: item?.class_id!,
        name: item?.class_name!,
        students:
          item?.students?.map((item) => ({
            id: item?.user_id!,
            name: item?.user_name!,
          })) || [],
      })) || [],
  }));
  // 所有学校的所有班级
  allSchools.forEach((item) => {
    allClasses = [...allClasses, ...item.classes];
  });
  // 不属于任何学校的班级加入所有班级
  if (!isSchool) {
    allClasses = [...allClasses, ...freedomClass];
  }
  // 所有学生
  allClasses.forEach((item) => {
    allStudents = [...allStudents, ...item.students];
  });
  // allStudents = allStudents.slice().sort(sortByStudentName("name"));
  allClasses.unshift({ id: "all", name: d("All").t("report_label_all"), students: [...allStudents] });
  // 给每个学校的班级添加all选项
  allSchools.forEach((item) => {
    let curAllStudent: UserType["classes"][0]["students"] = [];
    item.classes.forEach((item) => {
      curAllStudent = [...curAllStudent, ...item.students];
    });
    item.classes.unshift({ id: "all", name: d("All").t("report_label_all"), students: [...curAllStudent] });
  });
  allSchools.unshift({ id: "all", name: d("All").t("report_label_all"), classes: [...allClasses] });
  if (!isSchool) {
    allSchools.push({ id: "none", name: d("None").t("report_label_none"), classes: freedomClass });
  }
  return allSchools;
}
export function getDurationByDay(day: number) {
  const currentDate = moment().startOf("day").unix();
  return `${currentDate - 3600 * 24 * day}-${currentDate}`;
}

export function mGetDate(year: number, month: number) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

export function formatDate(time: any) {
  var date = new Date(time);
  return Math.floor(date.getTime() / 1000);
}

export function getSixMonths() {
  const arr = [];
  const needAddOne = moment().get("date") === 1 ? 1 : 0;
  for (let i = 5 + needAddOne; i >= 0 + needAddOne; i--) {
    if (i === 0 && moment().get("date") !== 1) {
      arr.push(`${moment().set("date", 1).startOf("day").unix()}-${moment().startOf("day").unix()}`);
    } else {
      arr.push(
        `${moment().subtract(i, "month").set("date", 1).startOf("day").unix()}-${moment()
          .subtract(i - 1, "month")
          .set("date", 1)
          .startOf("day")
          .unix()}`
      );
    }
  }
  return arr;
}

export function getFourWeeks() {
  const arr = [];
  var dd = moment().get("day");
  const needAddOne = moment().get("day") === 1 ? 1 : 0;
  for (let i = 3 + needAddOne; i >= 0 + needAddOne; i--) {
    if (i === 0 && moment().get("day") !== 1) {
      arr.push(
        `${moment()
          .subtract(dd - 1, "day")
          .startOf("day")
          .unix()}-${moment().startOf("day").unix()}`
      );
    } else {
      arr.push(
        `${moment().subtract(i, "week").set("day", 1).startOf("day").unix()}-${moment()
          .subtract(i, "week")
          .set("day", 7)
          .add(1, "day")
          .startOf("day")
          .unix()}`
      );
    }
  }
  return arr;
}

export function getLearnOutcomeAchievementFeedback(newData: any, studentName: string) {
  let data = newData.map((item: any) => ({
    class_average_achieved_percentage: item.class_average_achieved_percentage * 100,
    first_achieved_percentage: item.first_achieved_percentage * 100,
    re_achieved_percentage: item.re_achieved_percentage * 100,
    un_selected_subjects_average_achieved_percentage: item.un_selected_subjects_average_achieved_percentage * 100,
    first_achieved_count: item.first_achieved_count,
    re_achieved_count: item.re_achieved_count,
    un_achieved_count: item.un_achieved_count,
  }));

  if (
    data[0].class_average_achieved_percentage === 0 &&
    data[0].first_achieved_percentage === 0 &&
    data[0].re_achieved_percentage === 0 &&
    data[0].un_selected_subjects_average_achieved_percentage === 0 &&
    data[1].class_average_achieved_percentage === 0 &&
    data[1].first_achieved_percentage === 0 &&
    data[1].re_achieved_percentage === 0 &&
    data[1].un_selected_subjects_average_achieved_percentage === 0 &&
    data[2].class_average_achieved_percentage === 0 &&
    data[2].first_achieved_percentage === 0 &&
    data[2].re_achieved_percentage === 0 &&
    data[2].un_selected_subjects_average_achieved_percentage === 0
  ) {
    return t("report_msg_lo_new", {
      Name: studentName,
      AchievedLoCount: Math.ceil(data[3].first_achieved_count + data[3].re_achieved_count),
      LearntLoCount: Math.ceil(data[3].first_achieved_count + data[3].re_achieved_count + data[3].un_achieved_count),
    });
  } else if (
    (data[1].first_achieved_percentage + data[1].re_achieved_percentage > data[1].class_average_achieved_percentage &&
      data[2].first_achieved_percentage + data[2].re_achieved_percentage > data[2].class_average_achieved_percentage &&
      data[3].first_achieved_percentage + data[3].re_achieved_percentage > data[3].class_average_achieved_percentage) ||
    (data[1].first_achieved_percentage + data[1].re_achieved_percentage < data[1].class_average_achieved_percentage &&
      data[2].first_achieved_percentage + data[2].re_achieved_percentage < data[2].class_average_achieved_percentage &&
      data[3].first_achieved_percentage + data[3].re_achieved_percentage < data[3].class_average_achieved_percentage)
  ) {
    if (
      data[1].first_achieved_percentage + data[1].re_achieved_percentage > data[1].class_average_achieved_percentage &&
      data[2].first_achieved_percentage + data[2].re_achieved_percentage > data[2].class_average_achieved_percentage &&
      data[3].first_achieved_percentage + data[3].re_achieved_percentage > data[3].class_average_achieved_percentage
    ) {
      return t("report_msg_lo_high_class_3w", {
        Name: studentName,
        LOCompareClass3week: Math.ceil(
          (data[3].first_achieved_percentage +
            data[3].re_achieved_percentage -
            data[3].class_average_achieved_percentage +
            (data[2].first_achieved_percentage + data[2].re_achieved_percentage - data[2].class_average_achieved_percentage) +
            (data[1].first_achieved_percentage + data[1].re_achieved_percentage - data[1].class_average_achieved_percentage)) /
            3
        ),
      });
    } else {
      return t("report_msg_lo_low_class_3w", {
        Name: studentName,
        LOCompareClass3week: Math.ceil(
          (data[3].class_average_achieved_percentage -
            (data[3].first_achieved_percentage + data[3].re_achieved_percentage) +
            (data[2].class_average_achieved_percentage - (data[2].first_achieved_percentage + data[2].re_achieved_percentage)) +
            (data[1].class_average_achieved_percentage - (data[1].first_achieved_percentage + data[1].re_achieved_percentage))) /
            3
        ),
      });
    }
  } else if (
    data[3].first_achieved_percentage +
      data[3].re_achieved_percentage -
      (data[2].first_achieved_percentage + data[2].re_achieved_percentage) >=
      20 ||
    data[2].first_achieved_percentage +
      data[2].re_achieved_percentage -
      (data[3].first_achieved_percentage + data[3].re_achieved_percentage) >=
      20
  ) {
    if (
      data[3].first_achieved_percentage +
        data[3].re_achieved_percentage -
        (data[2].first_achieved_percentage + data[2].re_achieved_percentage) >=
      20
    ) {
      return t("report_msg_lo_increase_previous_large_w", {
        Name: studentName,
        LOCompareLastWeek: Math.ceil(
          data[3].first_achieved_percentage +
            data[3].re_achieved_percentage -
            (data[2].first_achieved_percentage + data[2].re_achieved_percentage)
        ),
      });
    } else {
      return t("report_msg_lo_decrease_previous_large_w", {
        Name: studentName,
        LOCompareLastWeek: Math.ceil(
          data[2].first_achieved_percentage +
            data[2].re_achieved_percentage -
            (data[3].first_achieved_percentage + data[3].re_achieved_percentage)
        ),
      });
    }
  } else if (
    data[3].re_achieved_percentage - data[3].class_average_achieved_percentage >= 10 ||
    data[3].class_average_achieved_percentage - data[3].re_achieved_percentage >= 10
  ) {
    if (data[3].re_achieved_percentage - data[3].class_average_achieved_percentage >= 10) {
      return t("report_msg_lo_high_class_review_w", {
        Name: studentName,
        LOReviewCompareClass: Math.ceil(data[3].re_achieved_percentage - data[3].class_average_achieved_percentage),
      });
    } else {
      return t("report_msg_lo_low_class_review_w", {
        Name: studentName,
        LOReviewCompareClass: Math.ceil(data[3].class_average_achieved_percentage - data[3].re_achieved_percentage),
      });
    }
  } else if (
    (data[2].first_achieved_percentage +
      data[2].re_achieved_percentage -
      (data[1].first_achieved_percentage + data[1].re_achieved_percentage) >
      0 &&
      data[1].first_achieved_percentage +
        data[1].re_achieved_percentage -
        (data[0].first_achieved_percentage + data[0].re_achieved_percentage) >
        0 &&
      data[3].first_achieved_percentage +
        data[3].re_achieved_percentage -
        (data[2].first_achieved_percentage + data[2].re_achieved_percentage) >
        0) ||
    (data[2].first_achieved_percentage +
      data[2].re_achieved_percentage -
      (data[1].first_achieved_percentage + data[1].re_achieved_percentage) <
      0 &&
      data[1].first_achieved_percentage +
        data[1].re_achieved_percentage -
        (data[0].first_achieved_percentage + data[0].re_achieved_percentage) <
        0 &&
      data[3].first_achieved_percentage +
        data[3].re_achieved_percentage -
        (data[2].first_achieved_percentage + data[2].re_achieved_percentage) <
        0)
  ) {
    if (
      data[2].first_achieved_percentage +
        data[2].re_achieved_percentage -
        (data[1].first_achieved_percentage + data[1].re_achieved_percentage) >
        0 &&
      data[3].first_achieved_percentage +
        data[3].re_achieved_percentage -
        (data[2].first_achieved_percentage + data[2].re_achieved_percentage) >
        0 &&
      data[1].first_achieved_percentage +
        data[1].re_achieved_percentage -
        (data[0].first_achieved_percentage + data[0].re_achieved_percentage) >
        0
    ) {
      return t("report_msg_lo_increase_3w", {
        Name: studentName,
        LOCompareLast3Week: Math.ceil(
          data[3].first_achieved_percentage +
            data[3].re_achieved_percentage -
            (data[0].first_achieved_percentage + data[0].re_achieved_percentage)
        ),
      });
    } else {
      return t("report_msg_lo_decrease_3w", {
        Name: studentName,
        LOCompareLast3Week: Math.ceil(
          data[0].first_achieved_percentage +
            data[0].re_achieved_percentage -
            (data[3].first_achieved_percentage + data[3].re_achieved_percentage)
        ),
      });
    }
  } else if (
    data[3].first_achieved_percentage + data[3].re_achieved_percentage > data[3].class_average_achieved_percentage ||
    data[3].first_achieved_percentage + data[3].re_achieved_percentage < data[3].class_average_achieved_percentage
  ) {
    if (data[3].first_achieved_percentage + data[3].re_achieved_percentage > data[3].class_average_achieved_percentage) {
      return t("report_msg_lo_high_class_w", {
        Name: studentName,
        LOCompareClass: Math.ceil(
          data[3].first_achieved_percentage + data[3].re_achieved_percentage - data[3].class_average_achieved_percentage
        ),
      });
    } else {
      return t("report_msg_lo_low_class_w", {
        Name: studentName,
        LOCompareClass: Math.ceil(
          data[3].class_average_achieved_percentage - (data[3].first_achieved_percentage + data[3].re_achieved_percentage)
        ),
      });
    }
  } else if (
    data[3].first_achieved_percentage +
      data[3].re_achieved_percentage -
      (data[2].first_achieved_percentage + data[2].re_achieved_percentage) <
      20 ||
    data[2].first_achieved_percentage +
      data[2].re_achieved_percentage -
      (data[3].first_achieved_percentage + data[3].re_achieved_percentage) <
      20
  ) {
    if (
      data[3].first_achieved_percentage +
        data[3].re_achieved_percentage -
        (data[2].first_achieved_percentage + data[2].re_achieved_percentage) <
      20
    ) {
      return t("report_msg_lo_increase_previous_w", {
        Name: studentName,
        LOCompareLastWeek: Math.ceil(
          data[3].first_achieved_percentage +
            data[3].re_achieved_percentage -
            (data[2].first_achieved_percentage + data[2].re_achieved_percentage)
        ),
      });
    } else {
      return t("report_msg_lo_decrease_previous_w", {
        Name: studentName,
        LOCompareLastWeek: Math.ceil(
          data[2].first_achieved_percentage +
            data[2].re_achieved_percentage -
            (data[3].first_achieved_percentage + data[3].re_achieved_percentage)
        ),
      });
    }
  } else {
    return t("report_msg_lo_default", {
      Name: studentName,
      AchievedLoCount: Math.ceil(data[3].first_achieved_count + data[3].re_achieved_count),
      LearntLoCount: Math.ceil(data[3].first_achieved_count + data[3].re_achieved_count + data[3].un_achieved_count),
    });
  }
}

export function getClassAttendanceFeedback(newData: any, studentName: string) {
  const data = newData.map((item: any) => ({
    attendance_percentage: item.attendance_percentage * 100,
    class_average_attendance_percentage: item.class_average_attendance_percentage * 100,
    un_selected_subjects_average_attendance_percentage: item.un_selected_subjects_average_attendance_percentage * 100,
    attended_count: item.attended_count,
    scheduled_count: item.scheduled_count,
  }));
  if (
    data[0].attendance_percentage === 0 &&
    data[0].class_average_attendance_percentage === 0 &&
    data[0].un_selected_subjects_average_attendance_percentage === 0 &&
    data[1].attendance_percentage === 0 &&
    data[1].class_average_attendance_percentage === 0 &&
    data[1].un_selected_subjects_average_attendance_percentage === 0 &&
    data[2].attendance_percentage === 0 &&
    data[2].class_average_attendance_percentage === 0 &&
    data[2].un_selected_subjects_average_attendance_percentage === 0
  ) {
    return t("report_msg_att_new", {
      Name: studentName,
      AttendedCount: Math.ceil(data[3].attended_count),
      ScheduledCount: Math.ceil(data[3].scheduled_count),
    });
  } else if (
    (data[1].attendance_percentage > data[1].class_average_attendance_percentage &&
      data[2].attendance_percentage > data[2].class_average_attendance_percentage &&
      data[3].attendance_percentage > data[3].class_average_attendance_percentage) ||
    (data[1].attendance_percentage < data[1].class_average_attendance_percentage &&
      data[2].attendance_percentage < data[2].class_average_attendance_percentage &&
      data[3].attendance_percentage < data[3].class_average_attendance_percentage)
  ) {
    if (
      data[1].attendance_percentage > data[1].class_average_attendance_percentage &&
      data[2].attendance_percentage > data[2].class_average_attendance_percentage &&
      data[3].attendance_percentage > data[3].class_average_attendance_percentage
    ) {
      return t("report_msg_att_high_class_3w", {
        Name: studentName,
        LOCompareClass3week: Math.ceil(
          (data[3].attendance_percentage -
            data[3].class_average_attendance_percentage +
            (data[2].attendance_percentage - data[2].class_average_attendance_percentage) +
            (data[1].attendance_percentage - data[1].class_average_attendance_percentage)) /
            3
        ),
      });
    } else {
      return t("report_msg_att_low_class_3w", {
        Name: studentName,
        LOCompareClass3week: Math.ceil(
          (data[3].class_average_attendance_percentage -
            data[3].attendance_percentage +
            (data[2].class_average_attendance_percentage - data[2].attendance_percentage) +
            (data[1].class_average_attendance_percentage - data[1].attendance_percentage)) /
            3
        ),
      });
    }
  } else if (
    data[3].attendance_percentage - data[2].attendance_percentage >= 20 ||
    data[2].attendance_percentage - data[3].attendance_percentage >= 20
  ) {
    if (data[3].attendance_percentage - data[2].attendance_percentage >= 20) {
      return t("report_msg_att_increase_previous_large_w", {
        Name: studentName,
        AttendCompareLastWeek: Math.ceil(data[3].attendance_percentage - data[2].attendance_percentage),
      });
    } else {
      return t("report_msg_att_decrease_previous_large_w", {
        Name: studentName,
        AttendCompareLastWeek: Math.ceil(data[2].attendance_percentage - data[3].attendance_percentage),
      });
    }
  } else if (
    (data[2].attendance_percentage - data[1].attendance_percentage > 0 &&
      data[1].attendance_percentage - data[0].attendance_percentage > 0 &&
      data[3].attendance_percentage - data[2].attendance_percentage > 0) ||
    (data[2].attendance_percentage - data[1].attendance_percentage < 0 &&
      data[1].attendance_percentage - data[0].attendance_percentage < 0 &&
      data[3].attendance_percentage - data[2].attendance_percentage < 0)
  ) {
    if (
      data &&
      data[1].attendance_percentage - data[0].attendance_percentage > 0 &&
      data[2].attendance_percentage - data[1].attendance_percentage > 0 &&
      data[3].attendance_percentage - data[2].attendance_percentage > 0
    ) {
      return t("report_msg_att_increase_3w", {
        Name: studentName,
        AttendCompareLast3Week: Math.ceil(data[3].attendance_percentage - data[0].attendance_percentage),
      });
    } else {
      return t("report_msg_att_decrease_3w", {
        Name: studentName,
        AttendCompareLast3Week: Math.ceil(data[0].attendance_percentage - data[3].attendance_percentage),
      });
    }
  } else if (
    data[3].attendance_percentage > data[3].class_average_attendance_percentage ||
    data[3].attendance_percentage < data[3].class_average_attendance_percentage
  ) {
    if (data[3].attendance_percentage > data[3].class_average_attendance_percentage) {
      return t("report_msg_att_high_class_w", {
        Name: studentName,
        LOCompareClass: Math.ceil(data[3].attendance_percentage - data[3].class_average_attendance_percentage),
      });
    } else {
      return t("report_msg_att_low_class_w", {
        Name: studentName,
        LOCompareClass: Math.ceil(data[3].class_average_attendance_percentage - data[3].attendance_percentage),
      });
    }
  } else if (
    data[3].attendance_percentage - data[2].attendance_percentage < 20 ||
    data[2].attendance_percentage - data[3].attendance_percentage < 20
  ) {
    if (data[3].attendance_percentage - data[2].attendance_percentage < 20) {
      return t("report_msg_att_increase_previous_w", {
        Name: studentName,
        AttendCompareLastWeek: Math.ceil(data[3].attendance_percentage - data[2].attendance_percentage),
      });
    } else {
      return t("report_msg_att_decrease_previous_w", {
        Name: studentName,
        AttendCompareLastWeek: Math.ceil(data[2].attendance_percentage - data[3].attendance_percentage),
      });
    }
  } else {
    return t("report_msg_att_default", {
      Name: studentName,
      AttendedCount: Math.ceil(data[3].attended_count),
      ScheduledCount: Math.ceil(data[3].scheduled_count),
    });
  }
}

export function getAssignmentCompletionFeedback(newData: any, studentName: string) {
  const data = newData.map((item: any) => ({
    class_designated_subject: item.class_designated_subject * 100,
    student_designated_subject: item.student_designated_subject * 100,
    student_non_designated_subject: item.student_non_designated_subject * 100,
    student_complete_assignment: item.student_complete_assignment,
    student_total_assignment: item.student_total_assignment,
  }));
  if (
    data[0].class_designated_subject === 0 &&
    data[0].student_designated_subject === 0 &&
    data[0].student_non_designated_subject === 0 &&
    data[1].class_designated_subject === 0 &&
    data[1].student_designated_subject === 0 &&
    data[1].student_non_designated_subject === 0 &&
    data[2].class_designated_subject === 0 &&
    data[2].student_designated_subject === 0 &&
    data[2].student_non_designated_subject === 0
  ) {
    return t("report_msg_assign_new", {
      Name: studentName,
      AssignmentCompleteCount: Math.ceil(data[3].student_complete_assignment),
      AssignmentCount: Math.ceil(data[3].student_total_assignment),
    });
  } else if (
    (data[1].student_designated_subject > data[1].class_designated_subject &&
      data[2].student_designated_subject > data[2].class_designated_subject &&
      data[3].student_designated_subject > data[3].class_designated_subject) ||
    (data[1].student_designated_subject < data[1].class_designated_subject &&
      data[2].student_designated_subject < data[2].class_designated_subject &&
      data[3].student_designated_subject < data[3].class_designated_subject)
  ) {
    if (
      data[1].student_designated_subject > data[1].class_designated_subject &&
      data[2].student_designated_subject > data[2].class_designated_subject &&
      data[3].student_designated_subject > data[3].class_designated_subject
    ) {
      return t("report_msg_assign_high_class_3w", {
        Name: studentName,
        AssignCompareClass3week: Math.ceil(
          (data[3].student_designated_subject -
            data[3].class_designated_subject +
            (data[2].student_designated_subject - data[2].class_designated_subject) +
            (data[1].student_designated_subject - data[1].class_designated_subject)) /
            3
        ),
      });
    } else {
      return t("report_msg_assign_low_class_3w", {
        Name: studentName,
        AssignCompareClass3week: Math.ceil(
          (data[3].class_designated_subject -
            data[3].student_designated_subject +
            (data[2].class_designated_subject - data[2].student_designated_subject) +
            (data[1].class_designated_subject - data[1].student_designated_subject)) /
            3
        ),
      });
    }
  } else if (
    data[3].student_designated_subject - data[2].student_designated_subject >= 20 ||
    data[2].student_designated_subject - data[3].student_designated_subject >= 20
  ) {
    if (data[3].student_designated_subject - data[2].student_designated_subject >= 20) {
      return t("report_msg_assign_increase_previous_large_w", {
        Name: studentName,
        AssignCompareLastWeek: Math.ceil(data[3].student_designated_subject - data[2].student_designated_subject),
      });
    } else {
      return t("report_msg_assign_decrease_previous_large_w", {
        Name: studentName,
        AssignCompareLastWeek: Math.ceil(data[2].student_designated_subject - data[3].student_designated_subject),
      });
    }
  } else if (
    (data[2].student_designated_subject - data[1].student_designated_subject > 0 &&
      data[1].student_designated_subject - data[0].student_designated_subject > 0 &&
      data[3].student_designated_subject - data[2].student_designated_subject > 0) ||
    (data[2].student_designated_subject - data[1].student_designated_subject < 0 &&
      data[1].student_designated_subject - data[0].student_designated_subject < 0 &&
      data[3].student_designated_subject - data[2].student_designated_subject < 0)
  ) {
    if (
      data[2].student_designated_subject - data[1].student_designated_subject > 0 &&
      data[1].student_designated_subject - data[0].student_designated_subject < 0 &&
      data[3].student_designated_subject - data[2].student_designated_subject > 0
    ) {
      return t("report_msg_assign_increase_3w", {
        Name: studentName,
        AssignCompare3Week: Math.ceil(data[3].student_designated_subject - data[0].student_designated_subject),
      });
    } else {
      return t("report_msg_assign_decrease_3w", {
        Name: studentName,
        AssignCompare3Week: Math.ceil(data[0].student_designated_subject - data[3].student_designated_subject),
      });
    }
  } else if (
    data[3].student_designated_subject > data[3].class_designated_subject ||
    data[3].student_designated_subject < data[3].class_designated_subject
  ) {
    if (data[3].student_designated_subject > data[3].class_designated_subject) {
      return t("report_msg_assign_high_class_w", {
        Name: studentName,
        AssignCompareClass: Math.ceil(data[3].student_designated_subject - data[3].class_designated_subject),
      });
    } else {
      return t("report_msg_assign_low_class_w", {
        Name: studentName,
        AssignCompareClass: Math.ceil(data[3].class_designated_subject - data[3].student_designated_subject),
      });
    }
  } else if (
    data[3].student_designated_subject - data[2].student_designated_subject < 20 ||
    data[2].student_designated_subject - data[3].student_designated_subject < 20
  ) {
    if (data[3].student_designated_subject - data[2].student_designated_subject < 20) {
      return t("report_msg_assign_increase_previous_w", {
        Name: studentName,
        AssignCompareLastWeek: Math.ceil(data[3].student_designated_subject - data[2].student_designated_subject),
      });
    } else {
      return t("report_msg_assign_decrease_previous_w", {
        Name: studentName,
        AssignCompareLastWeek: Math.ceil(data[2].student_designated_subject - data[3].student_designated_subject),
      });
    }
  } else {
    return t("report_msg_assign_default", {
      Name: studentName,
      AssignCompleteCount: Math.ceil(data[3].student_complete_assignment),
      AssignmentCount: Math.ceil(data[3].student_total_assignment),
    });
  }
}

export function translateMonth(month: number) {
  const months = [
    d("January").t("schedule_calendar_january"),
    d("February").t("schedule_calendar_february"),
    d("March").t("schedule_calendar_march"),
    d("April").t("schedule_calendar_april"),
    d("May").t("schedule_calendar_may"),
    d("June").t("schedule_calendar_june"),
    d("July").t("schedule_calendar_july"),
    d("August").t("schedule_calendar_august"),
    d("September").t("schedule_calendar_september"),
    d("October").t("schedule_calendar_october"),
    d("November").t("schedule_calendar_november"),
    d("December").t("schedule_calendar_december"),
  ];
  return months[month];
}

export function parsePercent(decimal?: number) {
  return Math.ceil((decimal || 0) * 100);
}
