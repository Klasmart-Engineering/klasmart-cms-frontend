/* eslint-disable react-hooks/exhaustive-deps */
import { enableNewGql } from "@api/extra";
import { Box, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import { orderByASC } from "@utilities/dataUtilities";
import clsx from "clsx";
import React from "react";
import { useSelector } from "react-redux";
import { Maybe, User } from "../../../api/api-ko-schema.auto";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import useTranslation from "../hooks/useTranslation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      position: "relative",
    },
    commonBox: {
      width: 180,
      marginLeft: 10,
    },
    studentBoxNone: {
      display: "none",
    },
  })
);

interface IState {
  schoolId: string;
  classId: string;
  studentId: string;
  subjectId: string;
}

type Field = "schoolId" | "classId" | "studentId";

interface IProps {
  onInitial?: (allSubjectId: string[]) => void;
  onChange?: (classId: string, studentId: string, studentName: string, selectedSubjectId: string[]) => void;
}

export default function StudentSubjectFilter({ onInitial, onChange }: IProps) {
  const classes = useStyles();
  const allFields = ["schoolId", "classId", "studentId"];
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const { schoolClassesStudentsSubjects } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const { schoolList, classList, noneSchoolClassList, programs, canSelectStudent } = schoolClassesStudentsSubjects;

  const [state, setState] = React.useState<IState>({
    schoolId: allValue,
    classId: "",
    studentId: "",
    subjectId: allValue,
  });
  const getAllSchoolList = (): MutiSelect.ISelect[] => {
    const list = schoolList
      .map((item) => ({
        value: item.school_id!,
        label: item.school_name!,
      }))
      .concat(noneSchoolClassList.length > 0 ? selectNoneSchoolOption : []);
    return orderByASC(list, "label");
  };

  const getAllClassList = (): MutiSelect.ISelect[] => {
    let data = [] as typeof classList;

    if (state.schoolId === allValue) {
      if (enableNewGql) {
        data = data.concat(classList);
      } else {
        data = data.concat(classList, noneSchoolClassList);
      }
    } else if (state.schoolId === noneValue) {
      data = noneSchoolClassList;
    } else {
      if (enableNewGql) {
        const classesByOrg = (schoolList.filter((school) => school.school_id === state.schoolId)[0]?.classes || []) as typeof classList;
        data = classesByOrg?.filter((item) => classList.find((classItem) => item?.class_id === classItem.class_id));
      } else {
        data = classList.filter((item) => {
          return (item.schools || []).find((school) => {
            return school?.school_id === state.schoolId;
          });
        });
      }
    }
    data = orderByASC(data, "class_name");
    return data.map((item) => ({
      value: item.class_id!,
      label: item.class_name!,
    }));
  };

  const getAllStudentList = (): MutiSelect.ISelect[] => {
    let data = [] as typeof classList;
    data = data.concat(classList, noneSchoolClassList);
    let students = (data.find((item) => item.class_id === state.classId)?.students || []).map((item) => ({
      ...item,
      full_name: `${item?.given_name} ${item?.family_name}`,
    })) as Maybe<User>[];
    students = orderByASC(students as { [key: string]: any }[], "full_name") as Maybe<User>[];
    return (students || []).map((item) => ({
      value: item!.user_id!,
      label: item!.full_name!,
    }));
  };

  const getAllSubjectList = (): MutiSelect.ISelect[] => {
    let data = [] as MutiSelect.ISelect[];
    programs.forEach((program) => {
      (program.subjects || []).forEach((subject) => {
        data.push({
          value: subject.id,
          label: `${program.name} - ${subject.name}`,
        });
      });
    });
    return orderByASC(data, "label");
  };

  const schoolOptions = React.useMemo<MutiSelect.ISelect[]>(getAllSchoolList, [schoolList]);
  const classOptions = React.useMemo<MutiSelect.ISelect[]>(getAllClassList, [schoolList, state.schoolId]);
  const studentOptions = React.useMemo<MutiSelect.ISelect[]>(getAllStudentList, [schoolList, state.schoolId, state.classId]);
  const subjectOptions = React.useMemo<MutiSelect.ISelect[]>(getAllSubjectList, [programs]);

  const setDefaultClass = () => {
    classOptions[0]?.value &&
      setState({
        ...state,
        classId: classOptions[0].value,
      });
  };
  const setDefaultStudent = () => {
    studentOptions[0]?.value &&
      setState({
        ...state,
        studentId: studentOptions[0].value,
      });
  };

  const initialCb = () => {
    onInitial && onInitial(subjectOptions.map((opt) => opt.value));
  };

  const changeCb = () => {
    // console.log("payload", state.studentId, state.subjectId);
    if (onChange && state.studentId && state.subjectId) {
      const studentName = studentOptions?.find((val) => val.value === state.studentId)?.label || "";
      onChange(
        state.classId,
        state.studentId,
        studentName,
        state.subjectId === allValue ? subjectOptions.map((opt) => opt.value) : [state.subjectId]
      );
    }
  };

  React.useEffect(setDefaultClass, [classOptions]);
  React.useEffect(setDefaultStudent, [studentOptions]);
  React.useEffect(initialCb, [subjectOptions]);
  React.useEffect(changeCb, [state.studentId, state.subjectId]);

  const handleChange = (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let newState = allFields.reduce((prev, cur) => {
      if (field === cur) {
        prev[cur] = event.target.value;
      } else if (Object.keys(prev).length > 0) {
        prev[cur as Field] = "";
      }
      return prev;
    }, {} as Pick<IState, "schoolId" | "classId" | "studentId">);

    setState((state) => ({
      ...state,
      ...newState,
    }));
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      subjectId: event.target.value,
    }));
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.commonBox}>
        <TextField
          fullWidth
          size="small"
          select
          //disabled={schoolOptions.length === 0}
          label={t("report_filter_school")}
          value={state.schoolId}
          onChange={handleChange("schoolId")}
        >
          {selectAllOption.concat(schoolOptions).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box className={classes.commonBox}>
        <TextField
          fullWidth
          size="small"
          select
          disabled={classOptions.length === 0}
          label={t("report_filter_class")}
          value={state.classId}
          onChange={handleChange("classId")}
        >
          {classOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box
        className={clsx({
          [classes.commonBox]: true,
          [classes.studentBoxNone]: !canSelectStudent,
        })}
      >
        <TextField
          fullWidth
          size="small"
          select
          disabled={studentOptions.length === 0}
          label={t("report_filter_student")}
          value={state.studentId}
          onChange={handleChange("studentId")}
        >
          {studentOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box className={classes.commonBox}>
        <TextField
          fullWidth
          size="small"
          select
          //disabled={schoolOptions.length === 0}
          label={t("report_filter_subject")}
          value={state.subjectId}
          onChange={handleSubjectChange}
        >
          {selectAllOption.concat(subjectOptions).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}
