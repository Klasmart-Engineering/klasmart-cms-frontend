import { orderByASC } from "@utilities/dataUtilities";
import { ReactNode } from "react";
import { Class, School, Status, User } from "../api/api-ko-schema.auto";
import {
  EntityClassesAssignmentsUnattendedStudentsView,
  EntityReportListTeachingLoadItem,
  EntityStudentAchievementReportCategoryItem,
} from "../api/api.auto";
import { HorizontalBarStackDataItem } from "../components/Chart/HorizontalBarStackChart";
import { d } from "../locale/LocaleManager";
import { UserType } from "../pages/ReportLearningSummary/types";
import { teacherLoadDescription } from "../pages/ReportTeachingLoad/components/TeacherLoadChart";

interface formatTeachingLoadListResponse {
  formatedData: HorizontalBarStackDataItem[];
  xLabels?: string[][];
}

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

export function getAllUsers(
  schools: Pick<School, "classes" | "school_id" | "school_name">[],
  noneSchoolClasses: Pick<Class, "class_id" | "class_name" | "schools" | "students" | "status">[],
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
    status: item.status,
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
  freedomClass = [
    { id: "all", name: d("All").t("report_label_all"), students: [...noSchoolAllStudents], status: Status.Active },
    ...freedomClass,
  ];
  // 所有学校
  let allSchools = schools.map((item) => ({
    id: item.school_id!,
    name: item.school_name!,
    classes:
      item.classes?.map((item) => ({
        id: item?.class_id!,
        name: item?.class_name!,
        status: item?.status,
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
  allClasses.unshift({ id: "all", name: d("All").t("report_label_all"), students: [...allStudents], status: Status.Active });
  // 给每个学校的班级添加all选项
  allSchools.forEach((item) => {
    let curAllStudent: UserType["classes"][0]["students"] = [];
    item.classes = orderByASC(item.classes, "name");
    item.classes.forEach((item) => {
      curAllStudent = [...curAllStudent, ...item.students];
    });
    item.classes.unshift({ id: "all", name: d("All").t("report_label_all"), students: [...curAllStudent], status: Status.Active });
  });

  allSchools = orderByASC(allSchools, "name");
  allSchools.unshift({ id: "all", name: d("All").t("report_label_all"), classes: [...allClasses] });
  if (!isSchool) {
    allSchools.push({ id: "none", name: d("None").t("report_label_none"), classes: freedomClass });
  }
  return allSchools;
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

export function getLabel(labelParams: any, labelName: any) {
  const labelObj = labelParams || {};

  let newLabel = {} as keyof typeof labelObj;
  Object.keys(labelObj)?.forEach((key) => {
    Object(newLabel)[labelName[key as keyof typeof labelObj]] = labelObj[key as keyof typeof labelObj];
  });
  return newLabel;
}

export function parsePercent(decimal?: number) {
  return Math.ceil((decimal || 0) * 100);
}
