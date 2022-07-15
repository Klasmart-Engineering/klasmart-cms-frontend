import { ClassFilter, Maybe, Program, UuidExclusiveFilter, UuidExclusiveOperator, UuidOperator } from "@api/api-ko-schema.auto";
import { QueryMyUserDocument, QueryMyUserQuery, QueryMyUserQueryVariables } from "@api/api-ko.auto";
import { apiOrganizationOfPage, getClassList, getClassNodeStudents, getSchoolList, SelectItem } from "@api/extra";
import { gqlapi } from "@api/index";
import PermissionType from "@api/PermissionType";
import { SelectMore } from "@components/SelectMore/SelectMore";
import { t } from "@locale/LocaleManager";
import { Box } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import programsHandler from "@reducers/contentEdit/programsHandler";
import { actSetLoading } from "@reducers/loading";
import permissionCache from "@services/permissionCahceService";
import React from "react";
import { useDispatch } from "react-redux";
import useTranslation from "../hooks/useTranslation";
const useStyle = makeStyles((theme) =>
  createStyles({
    select: {
      width: 180,
      marginLeft: 10,
    },
    selectBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
  })
);

interface IState {
  schoolId: string;
  classId: string;
  studentId: string;
  subjectId: string;
  schools: SelectItem[];
  classes: SelectItem[];
  students: SelectItem[];
  subjects: SelectItem[];
  classCursor: string;
  studentCursor: string;
  schoolCursor: string;
}
interface IUserInfo {
  user: { value: string; label: string };
  isTeacher: boolean;
  isStudent: boolean;
  isSchoolAdmin?: boolean;
}
export interface IList {
  list: SelectItem[];
  cursor: string;
}
interface IProps {
  onInitial?: (allSubjectId: string[]) => void;
  onChange?: (classId: string, studentId: string, studentName: string, selectedSubjectId: string[]) => void;
}
export default function StudentFilter({ onChange, onInitial }: IProps) {
  const dispatch = useDispatch();
  const css = useStyle();
  const { allValue, noneValue, selectAllOption, selectNoneSchoolOption } = useTranslation();
  const [state, setState] = React.useState<IState>({
    schoolId: "",
    classId: "",
    studentId: "",
    subjectId: "",
    classCursor: "",
    studentCursor: "",
    schoolCursor: "",
    schools: [],
    classes: [],
    students: [],
    subjects: [],
  });
  const [userInfo, setUserInfo] = React.useState<IUserInfo>({ user: { label: "", value: "" }, isStudent: false, isTeacher: false });
  const [classLoading, setClassLoading] = React.useState(false);
  const [studentLoading, setStudentLoading] = React.useState(false);
  const [schoolLoading, setSchoolLoading] = React.useState(false);
  const { schoolId, classId, studentId, subjectId, classCursor, studentCursor, schoolCursor, schools, classes, students, subjects } = state;
  const organizationId = {
    operator: UuidOperator.Eq,
    value: apiOrganizationOfPage(),
  };

  const getClassFilter = (value: string, userInfo: IUserInfo) => {
    const { user, isStudent, isTeacher } = userInfo;
    let newFilter: ClassFilter = { organizationId };
    let schoolId: Maybe<UuidExclusiveFilter> = { operator: UuidExclusiveOperator.Eq, value };
    const userFilter = {
      operator: UuidOperator.Eq,
      value: user.value,
    };
    if (isTeacher && user.value) newFilter = { ...newFilter, teacherId: userFilter };
    if (isStudent && user.value) newFilter = { ...newFilter, studentId: userFilter };
    if (value === noneValue) schoolId = { operator: UuidExclusiveOperator.IsNull };
    return { newFilter, schoolId };
  };
  const getClassesList = async (value: string, userInfo: IUserInfo, cursor?: string): Promise<IList> => {
    const { newFilter, schoolId } = getClassFilter(value, userInfo);
    let classList = [];
    let classCursor = "";
    if (value === allValue) {
      const res = await getClassList({ filter: newFilter, cursor });
      classList = res.list;
      classCursor = res.cursor;
    } else {
      const res = await getClassList({ filter: { ...newFilter, schoolId }, cursor });
      classList = res.list;
      classCursor = res.cursor;
    }
    return { list: classList, cursor: classCursor };
  };

  const getStudentList = async (value: string, cursor?: string): Promise<IList> => {
    if (!value) return { list: [], cursor: "" };
    const { list, cursor: studentCursor } = await getClassNodeStudents(value, cursor);
    return { list: list, cursor: studentCursor };
  };

  const getSubjectList = async () => {
    let data: SelectItem[] = [];
    const programs: Pick<Program, "id" | "name" | "subjects">[] = await programsHandler.getProgramsOptions(true, true);
    programs.forEach((program) => {
      (program.subjects || []).forEach((subject) => {
        data.push({
          value: subject.id,
          label: `${program.name} - ${subject.name}`,
        });
      });
    });
    return data;
  };
  const filterOnLoad = async () => {
    let value = "";
    let label = "";
    dispatch(actSetLoading(true));
    const perm = await permissionCache.usePermission([
      PermissionType.report_student_progress_organization_658,
      PermissionType.report_student_progress_school_659,
      PermissionType.report_student_progress_teacher_660,
      PermissionType.report_student_progress_student_661,
    ]);
    const isTeacher = !!(
      !perm.report_student_progress_organization_658 &&
      !perm.report_student_progress_school_659 &&
      perm.report_student_progress_teacher_660
    );
    const isStudent = !!(
      !perm.report_student_progress_organization_658 &&
      !perm.report_student_progress_school_659 &&
      perm.report_student_progress_student_661
    );
    const isSchoolAdmin = perm.report_student_progress_school_659 && !perm.report_student_progress_organization_658;
    if (isTeacher || isStudent) {
      const {
        data: { myUser },
      } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
        query: QueryMyUserDocument,
      });
      value = myUser?.node?.id || "";
      label = `${myUser?.node?.givenName} ${myUser?.node?.familyName}`;
    }
    const newUserInfo: IUserInfo = { user: { value, label }, isTeacher, isStudent, isSchoolAdmin };
    setUserInfo(newUserInfo);
    const [{ list: schools, cursor: schoolCursor }, { list: classes, cursor: classCursor }, subjects] = await Promise.all([
      getSchoolList({ filter: { organizationId } }),
      getClassesList(allValue, newUserInfo),
      getSubjectList(),
    ]);
    const classId = classes && classes.length ? classes[0].value : "";
    const { list: students, cursor: studentCursor } =
      classId && isStudent ? { list: [{ value, label }], cursor: "" } : await getStudentList(classId);
    dispatch(actSetLoading(false));

    const studentId = students[0]?.value || "";
    setState({
      schoolId: allValue,
      classId,
      studentId,
      subjectId: allValue,
      schoolCursor,
      classCursor,
      studentCursor,
      schools: selectAllOption.concat(schools),
      classes,
      students,
      subjects,
    });
  };

  const handleChangeSchool = async (value: string) => {
    dispatch(actSetLoading(true));
    const { user, isStudent } = userInfo;
    const { list: classes, cursor: classCursor } = (await getClassesList(value, userInfo)) || [];
    const classId = classes?.length ? classes[0].value : "";
    const { list: students, cursor: studentCursor } = classId && isStudent ? { list: [user], cursor: "" } : await getStudentList(classId);
    dispatch(actSetLoading(false));
    const studentId = students && students?.length ? students[0]?.value : "";
    const newState = { ...state, classes, students, schoolId: value, classId, studentId, classCursor, studentCursor };
    setState(newState);
  };
  const handleChangeClass = async (value: string) => {
    if (!value) return;
    const { user, isStudent } = userInfo;
    dispatch(actSetLoading(true));
    const { list: students, cursor: studentCursor } = value && isStudent ? { list: [user], cursor: "" } : await getStudentList(value);
    dispatch(actSetLoading(false));
    const studentId = students && students?.length ? students[0]?.value : "";
    const newState = { ...state, students, classId: value, studentId, studentCursor };
    setState(newState);
  };
  const handleChangeStudent = (value: string) => setState({ ...state, studentId: value });
  const handleSubjectChange = (value: string) => setState({ ...state, subjectId: value });

  const getNextPageSchool = async () => {
    setSchoolLoading(true);
    const { list, cursor } = await getSchoolList({ filter: { organizationId }, cursor: schoolCursor });
    setState({ ...state, schoolCursor: cursor, schools: schools.concat(list) });
    setSchoolLoading(false);
  };
  const getNextPageClass = async () => {
    setClassLoading(true);
    const { list, cursor } = await getClassesList(schoolId, userInfo, classCursor);
    setState({ ...state, classCursor: cursor, classes: classes.concat(list) });
    setClassLoading(false);
  };
  const getNextPageStudent = async () => {
    setStudentLoading(true);
    const { list, cursor } = await getStudentList(classId, studentCursor);
    setState({ ...state, studentCursor: cursor, students: students.concat(list) });
    setStudentLoading(false);
  };

  const initialCb = () => {
    onInitial && onInitial(subjects.map((opt) => opt.value));
  };
  const changeCb = () => {
    if (onChange && subjectId) {
      const studentName = students?.find((val) => val.value === studentId)?.label || "";
      onChange(classId, studentId, studentName, subjectId === allValue ? subjects.map((opt) => opt.value) : [subjectId]);
    }
  };
  React.useEffect(
    initialCb,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjects]
  );
  React.useEffect(
    changeCb,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [classId, studentId, subjectId]
  );
  React.useEffect(() => {
    if (schools.length || classes.length) return;
    filterOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schools.length]);
  return (
    <div className={css.selectBox}>
      <Box className={css.select}>
        <SelectMore
          label={t("report_filter_school")}
          list={userInfo?.isSchoolAdmin ? schools : schools.concat(selectNoneSchoolOption)}
          value={schoolId ?? ""}
          onChange={handleChangeSchool}
          cursor={schoolCursor}
          loading={schoolLoading}
          getNextPageList={getNextPageSchool}
        />
      </Box>
      <Box className={css.select}>
        <SelectMore
          label={t("report_filter_class")}
          list={classes}
          value={classId ?? ""}
          onChange={handleChangeClass}
          cursor={classCursor}
          loading={classLoading}
          getNextPageList={getNextPageClass}
        />
      </Box>
      {!userInfo.isStudent && (
        <Box className={css.select}>
          <SelectMore
            label={t("report_filter_student")}
            list={students}
            value={studentId ?? ""}
            onChange={handleChangeStudent}
            cursor={studentCursor}
            loading={studentLoading}
            getNextPageList={getNextPageStudent}
          />
        </Box>
      )}
      <Box className={css.select}>
        <SelectMore
          label={t("report_filter_subject")}
          list={selectAllOption.concat(subjects)}
          value={subjectId ?? ""}
          onChange={handleSubjectChange}
        />
      </Box>
    </div>
  );
}
