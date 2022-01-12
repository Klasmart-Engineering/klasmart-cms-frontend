import { ParticipantRoleId, ParticipantString, ParticipantValue } from "@api/type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import api, { gqlapi } from "../api";
import { BooleanOperator, ConnectionDirection, StringOperator, UuidExclusiveOperator, UuidOperator } from "../api/api-ko-schema.auto";
import {
  ClassesByOrganizationDocument,
  ClassesByOrganizationQuery,
  ClassesByOrganizationQueryVariables,
  ClassesBySchoolDocument,
  ClassesBySchoolQuery,
  ClassesBySchoolQueryVariables,
  ClassesByTeacherQuery,
  ClassesStudentQueryDocument,
  ClassesStudentQueryQuery,
  ClassesStudentQueryQueryVariables,
  ClassesTeachingQueryDocument,
  ClassesTeachingQueryQuery,
  ClassesTeachingQueryQueryVariables,
  GetClassByInfoDocument,
  GetClassByInfoQuery,
  GetClassByInfoQueryVariables,
  GetClassFilterListDocument,
  GetClassFilterListQuery,
  GetClassFilterListQueryVariables,
  GetProgramsDocument,
  GetProgramsQuery,
  GetProgramsQueryVariables,
  GetRolesIdDocument,
  GetRolesIdQuery,
  GetRolesIdQueryVariables,
  GetSchoolsFilterListDocument,
  GetSchoolsFilterListQuery,
  GetSchoolsFilterListQueryVariables,
  GetUserDocument,
  GetUserQuery,
  GetUserQueryVariables,
  MySchoolIDsDocument,
  MySchoolIDsQuery,
  MySchoolIDsQueryVariables,
  ParticipantsByClassQuery,
  QeuryMeDocument,
  QeuryMeQuery,
  QeuryMeQueryVariables,
  SchoolByOrgQueryDocument,
  SchoolByOrgQueryQuery,
  SchoolByOrgQueryQueryVariables,
  SchoolByUserQueryDocument,
  SchoolByUserQueryQuery,
  SchoolByUserQueryQueryVariables,
  TeachersByOrgnizationDocument,
  TeachersByOrgnizationQuery,
  TeachersByOrgnizationQueryVariables,
} from "../api/api-ko.auto";
import {
  ApiSuccessRequestResponse,
  EntityLessonPlanForSchedule,
  EntityQueryContentItem,
  EntityScheduleAddView,
  EntityScheduleDetailsView,
  EntityScheduleFeedbackAddInput,
  EntityScheduleFeedbackView,
  EntityScheduleListView,
  EntityScheduleSearchView,
  EntityScheduleTimeView,
  EntityScheduleViewDetail,
  ModelPublishedOutcomeView,
} from "../api/api.auto";
import { apiGetMockOptions, apiWaitForOrganizationOfPage, MockOptions } from "../api/extra";
import teacherListByOrg from "../mocks/teacherListByOrg.json";
import {
  ChangeParticipants,
  ClassesData,
  EntityScheduleSchoolInfo,
  filterOptionItem,
  ParticipantsData,
  ParticipantsShortInfo,
  RolesData,
} from "../types/scheduleTypes";
import programsHandler, { LinkedMockOptionsItem } from "./contentEdit/programsHandler";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncTrunkReturned } from "./type";

const MOCK = false;

interface classOptionsProp {
  classListOrg: ClassesByOrganizationQuery;
  classListTeacher: ClassesByTeacherQuery;
  classListSchool: ClassesBySchoolQuery;
  classListStudent: ClassesStudentQueryQuery;
}

export interface ScheduleState {
  total: number;
  searchScheduleList: EntityScheduleSearchView[];
  saveResult: number;
  scheduleDetial: EntityScheduleDetailsView;
  scheduleTimeViewData: EntityScheduleTimeView[];
  scheduleTimeViewTotal: number;
  scheduleAnyTimeViewData: EntityScheduleListView[];
  scheduleTimeViewYearData: [];
  attachement_id: string;
  attachment_path: string;
  searchFlag: boolean;
  mockOptions: MockOptions;
  errorLable: string;
  scheduleMockOptions: getScheduleMockOptionsResponse;
  participantMockOptions: getScheduleParticipantsMockOptionsResponse;
  liveToken: string;
  contentsAuthList: EntityQueryContentItem[];
  classOptions: classOptionsProp;
  ParticipantsData: ParticipantsData;
  participantsIds: ParticipantsShortInfo;
  classRosterIds: ParticipantsShortInfo;
  mySchoolId: string[];
  feedbackData: EntityScheduleFeedbackView;
  filterOption: filterOptionItem;
  schoolByOrgOrUserData: EntityScheduleSchoolInfo[];
  mediaList: EntityQueryContentItem[];
  ScheduleViewInfo: EntityScheduleViewDetail;
  outcomeList: ModelPublishedOutcomeView[];
  outcomeListInit: ModelPublishedOutcomeView[];
  outcomeTotal: number;
  programChildInfo: GetProgramsQuery;
  developmental: LinkedMockOptionsItem[];
  skills: LinkedMockOptionsItem[];
  schoolsConnection: GetSchoolsFilterListQuery;
  classesConnection: GetClassFilterListQuery;
  filterOtherClasses: GetClassFilterListQuery;
  lessonPlans: EntityLessonPlanForSchedule[];
  userInUndefined: GetUserQuery;
}

interface Rootstate {
  schedule: ScheduleState;
}

export const initScheduleDetial: EntityScheduleDetailsView = {
  id: "",
  title: "",
  class: {},
  lesson_plan: {},
  start_at: 0,
  end_at: 0,
  repeat: {},
  subjects: [],
  program: {},
  class_type: "OnlineClass",
  class_type_label: {},
  due_at: 0,
  description: "",
  attachment: {},
  is_all_day: true,
  is_repeat: false,
  real_time_status: {},
  outcome_ids: [],
};

const initialState: ScheduleState = {
  contentsAuthList: [],
  saveResult: 1,
  total: 0,
  searchScheduleList: [],
  scheduleDetial: initScheduleDetial,
  scheduleTimeViewData: [],
  scheduleTimeViewTotal: 0,
  scheduleAnyTimeViewData: [],
  scheduleTimeViewYearData: [],
  attachement_id: "",
  attachment_path: "",
  searchFlag: false,
  mockOptions: {
    options: [],
    visibility_settings: [],
    lesson_types: [],
    classes: [],
    class_types: [],
    organizations: [],
    teachers: [],
    students: [],
    users: [],
    teacher_class_relationship: [],
  },
  errorLable: "",
  scheduleMockOptions: {
    teacherList: {
      organization: {
        teachers: [],
      },
    },
    subjectList: [],
    programList: [],
    classTypeList: [
      {
        id: "OfflineClass",
        name: "schedule_detail_offline_class",
      },
      {
        id: "OnlineClass",
        name: "schedule_detail_online_class",
      },
      {
        id: "Homework",
        name: "schedule_detail_homework",
      },
      {
        id: "Task",
        name: "schedule_detail_task",
      },
    ],
  },
  participantMockOptions: {
    participantList: {
      class: {
        teachers: [],
        students: [],
      },
    },
  },
  liveToken: "",
  classOptions: {
    classListOrg: {
      organization: {
        classes: [],
      },
    },
    classListTeacher: {
      user: {
        classesTeaching: [],
      },
    },
    classListStudent: {
      user: {
        membership: {
          classes: [],
        },
      },
    },
    classListSchool: {
      school: {
        classes: [],
      },
    },
  },
  ParticipantsData: {
    classes: {
      students: [],
      teachers: [],
    },
    total: 0,
    hash: {
      teacher: "",
      student: "",
    },
    next: {
      teacher: false,
      student: false,
    },
  },
  participantsIds: { student: [], teacher: [] },
  classRosterIds: { student: [], teacher: [] },
  mySchoolId: [],
  feedbackData: {
    assignments: [],
    comment: "",
    create_at: 0,
    id: "",
    schedule_id: "",
    user_id: "",
    is_allow_submit: false,
  },
  filterOption: {
    classType: [
      {
        id: "Homework",
        name: "schedule_detail_homework",
      },
      {
        id: "OfflineClass",
        name: "schedule_detail_offline_class",
      },
      {
        id: "OnlineClass",
        name: "schedule_detail_online_class",
      },
      {
        id: "Task",
        name: "schedule_detail_task",
      },
    ],
    programs: [],
    others: [],
  },
  schoolByOrgOrUserData: [],
  mediaList: [],
  ScheduleViewInfo: {},
  outcomeList: [],
  outcomeListInit: [],
  outcomeTotal: 0,
  programChildInfo: {},
  developmental: [],
  skills: [],
  schoolsConnection: {},
  classesConnection: {},
  lessonPlans: [],
  userInUndefined: {},
  filterOtherClasses: {},
};

type AsyncReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

type querySchedulesParams = { data: Parameters<typeof api.schedules.querySchedule>[0] } & LoadingMetaPayload;
type querySchedulesResult = ReturnType<typeof api.schedules.querySchedule>;
export const getSearchScheduleList = createAsyncThunk<querySchedulesResult, querySchedulesParams>("schedule/scheduleList", ({ data }) => {
  return api.schedules.querySchedule(data);
});

type SaveStatusResourseParams = {
  payload: EntityScheduleAddView;
  is_new_schedule: boolean;
};
export const saveScheduleData = createAsyncThunk<
  EntityScheduleAddView,
  SaveStatusResourseParams & LoadingMetaPayload,
  { state: Rootstate }
>(
  "schedule/save",
  // @ts-ignore
  async ({ payload, is_new_schedule }, { getState }) => {
    let {
      schedule: {
        scheduleDetial: { id },
      },
    } = getState();
    if (!id || is_new_schedule) {
      const result = await api.schedules.addSchedule(payload).catch((err) => Promise.reject(err.label));
      // @ts-ignore
      if (!result.data?.id) return result;
      // @ts-ignore
      id = result.data?.id;
    } else {
      // @ts-ignore
      const result = await api.schedules.updateSchedule(id, payload).catch((err) => Promise.reject(err.label));
      // @ts-ignore
      if (!result.data?.id) return result;
      // @ts-ignore
      id = result.data?.id;
    }
    // @ts-ignore
    return await api.schedules.getScheduleById(id).catch((err) => Promise.reject(err.label));
  }
);

type viewSchedulesParams = Parameters<typeof api.schedulesTimeView.getScheduleTimeViewList>[0] & LoadingMetaPayload;
type viewSchedulesResultResponse = AsyncReturnType<typeof api.schedulesTimeView.getScheduleTimeViewList>;
export const getScheduleTimeViewData = createAsyncThunk<viewSchedulesResultResponse, viewSchedulesParams>(
  "schedule/schedules_time_view",
  async (query) => {
    return api.schedulesTimeView.getScheduleTimeViewList({ ...query });
  }
);

type yearSchedulesParams = Parameters<typeof api.schedulesTimeView.postScheduledDates>[0] & LoadingMetaPayload;
type yearSchedulesResultResponse = AsyncReturnType<typeof api.schedulesTimeView.getScheduledDates>;
export const getScheduleTimeViewDataByYear = createAsyncThunk<yearSchedulesResultResponse, yearSchedulesParams>(
  "schedule/schedules_time_view_year",
  async (query) => {
    return api.schedulesTimeView.postScheduledDates({ ...query });
  }
);

type viewSchedulesAnyTimeResultResponse = AsyncReturnType<typeof api.schedulesTimeView.getScheduleTimeView>;
type viewSchedulesAnTimeParams = Parameters<typeof api.schedulesTimeView.getScheduleTimeView>[0] & LoadingMetaPayload;
export const getScheduleAnyTimeViewData = createAsyncThunk<viewSchedulesAnyTimeResultResponse, viewSchedulesAnTimeParams>(
  "schedule/schedules_any_time_view",
  async (query) => {
    return api.schedulesTimeView.getScheduleTimeView({ ...query });
  }
);

/**
 *  get class by teacher
 */
export const getClassesByTeacher = createAsyncThunk("getClassesByTeacher", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  return gqlapi.query<ClassesTeachingQueryQuery, ClassesTeachingQueryQueryVariables>({
    query: ClassesTeachingQueryDocument,
    variables: {
      user_id: meInfo.me?.user_id as string,
      organization_id,
    },
  });
});

type lessonPlansByScheduleParams = Parameters<typeof api.contentsLessonPlans.getLessonPlansCanSchedule>[0] & LoadingMetaPayload;
type lessonPlansByScheduleResult = ReturnType<typeof api.contentsLessonPlans.getLessonPlansCanSchedule>;
export const getLessonPlansBySchedule = createAsyncThunk<lessonPlansByScheduleResult, lessonPlansByScheduleParams>("content/plans", () => {
  return api.contentsLessonPlans.getLessonPlansCanSchedule();
});

/**
 *  get class by student
 */
export const getClassesByStudent = createAsyncThunk("getClassesByStudent", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  return gqlapi.query<ClassesStudentQueryQuery, ClassesStudentQueryQueryVariables>({
    query: ClassesStudentQueryDocument,
    variables: {
      user_id: meInfo.me?.user_id as string,
      organization_id,
    },
  });
});

export const getUserInUndefined = createAsyncThunk<GetUserQuery, GetUserQueryVariables & LoadingMetaPayload>(
  "getUserInUndefined",
  // @ts-ignore
  async ({ direction, directionArgs }) => {
    const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
    return await gqlapi.query<GetUserQuery, GetUserQueryVariables>({
      query: GetUserDocument,
      variables: {
        filter: {
          organizationId: { operator: UuidOperator.Eq, value: organization_id },
          organizationUserStatus: { operator: StringOperator.Eq, value: "active" },
          classId: { operator: UuidExclusiveOperator.IsNull },
          schoolId: { operator: UuidExclusiveOperator.IsNull },
        },
        direction: direction,
        directionArgs: directionArgs,
      },
    });
  }
);

export const classesWithoutSchool = createAsyncThunk<GetClassFilterListQuery, GetClassFilterListQueryVariables & LoadingMetaPayload>(
  "classesWithoutSchool",
  // @ts-ignore
  async ({ filter, direction, directionArgs }) => {
    const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
    return gqlapi.query<GetClassFilterListQuery, GetClassFilterListQueryVariables>({
      query: GetClassFilterListDocument,
      variables: {
        filter: {
          schoolId: { operator: UuidExclusiveOperator.IsNull },
          organizationId: { operator: UuidOperator.Eq, value: organization_id },
          status: { operator: StringOperator.Eq, value: "active" },
          ...filter,
        },
        direction: direction,
        directionArgs: directionArgs,
      },
    });
  }
);

/**
 *  get class by org
 */
export const getClassesByOrg = createAsyncThunk("getClassesByOrg", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  return gqlapi.query<ClassesByOrganizationQuery, ClassesByOrganizationQueryVariables>({
    query: ClassesByOrganizationDocument,
    variables: {
      organization_id,
    },
  });
});

export const getProgramChild = createAsyncThunk<getProgramsChildResponse, getProgramsChildPayLoad>(
  "getProgramChild",
  async ({ program_id }) => {
    const { data } = await gqlapi.query<GetProgramsQuery, GetProgramsQueryVariables>({
      query: GetProgramsDocument,
      variables: {
        program_id: program_id,
      },
    });
    const programChildInfo = data;
    return { programChildInfo };
  }
);

interface participantsDataInterface extends LoadingMetaPayload {
  is_org: boolean;
  hash: string;
  name: string;
  roleName: ParticipantString["key"]; //student / teacher
}

export const getParticipantsData = createAsyncThunk<ParticipantsData, participantsDataInterface, { state: Rootstate }>(
  "getParticipantsData",
  // @ts-ignore
  async ({ is_org, hash, name, roleName }, { getState }) => {
    const {
      schedule: { ParticipantsData },
    } = getState();
    const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
    let filterQuery = {};
    if (is_org) {
      filterQuery = { organizationId: { operator: UuidExclusiveOperator.Eq, value: organization_id } };
    } else {
      const { data: schoolInfo } = await gqlapi.query<MySchoolIDsQuery, MySchoolIDsQueryVariables>({
        query: MySchoolIDsDocument,
        variables: { organization_id },
      });
      const school_ids = schoolInfo.me?.membership?.schoolMemberships?.map((item) => {
        return { schoolId: { operator: UuidExclusiveOperator.Eq, value: item?.school_id } };
      });
      filterQuery = { OR: school_ids };
      if (!school_ids?.length) {
        return { classes: [{ students: [], teachers: [] }] };
      }
    }
    if (name) {
      filterQuery = {
        AND: [
          {
            OR: [
              { givenName: { operator: "contains", value: name, caseInsensitive: true } },
              { familyName: { operator: "contains", value: name, caseInsensitive: true } },
            ],
          },
        ],
        ...filterQuery,
      };
    }
    const { data: roleData } = await gqlapi.query<GetRolesIdQuery, GetRolesIdQueryVariables>({
      query: GetRolesIdDocument,
      variables: {
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 10 },
        filter: { system: { operator: BooleanOperator.Eq, value: true } },
      },
    });
    const StudentAndTeacherRoleId: ParticipantRoleId = {};
    roleData.rolesConnection?.edges?.forEach((item) => {
      if (item?.node?.name === ParticipantValue.student) {
        StudentAndTeacherRoleId.Student = item.node.id;
      }
      if (item?.node?.name === ParticipantValue.teacher) {
        StudentAndTeacherRoleId.Teacher = item.node.id;
      }
    });
    const { data } = await gqlapi.query<GetUserQuery, GetUserQueryVariables>({
      query: GetUserDocument,
      variables: {
        filter: {
          organizationUserStatus: { operator: StringOperator.Eq, value: "active" },
          roleId: { operator: UuidOperator.Eq, value: StudentAndTeacherRoleId[roleName] },
          ...filterQuery,
        },
        direction: ConnectionDirection.Forward,
        directionArgs: { count: 20, cursor: hash },
      },
    });
    const participantListOrigin = data;
    const students: { user_id: string | undefined; user_name: string | null | undefined }[] = [];
    const teachers: { user_id: string | undefined; user_name: string | null | undefined }[] = [];
    participantListOrigin.usersConnection?.edges?.forEach((item) => {
      if (item?.node?.status !== "active") return;
      item?.node?.roles?.forEach((role) => {
        if (roleName === ParticipantValue.teacher && role.name === ParticipantValue.teacher)
          teachers.push({ user_id: item.node?.id, user_name: item.node?.givenName + " " + item.node?.familyName });
        if (roleName === ParticipantValue.student && role.name === ParticipantValue.student)
          students.push({ user_id: item.node?.id, user_name: item.node?.givenName + " " + item.node?.familyName });
      });
    });
    const studentHash =
      roleName === ParticipantValue.student ? participantListOrigin.usersConnection?.pageInfo?.endCursor : ParticipantsData.hash.student;
    const teacherHash =
      roleName === ParticipantValue.teacher ? participantListOrigin.usersConnection?.pageInfo?.endCursor : ParticipantsData.hash.teacher;
    const studentNext =
      roleName === ParticipantValue.student ? participantListOrigin.usersConnection?.pageInfo?.hasNextPage : ParticipantsData.next.student;
    const teacherNext =
      roleName === ParticipantValue.teacher ? participantListOrigin.usersConnection?.pageInfo?.hasNextPage : ParticipantsData.next.teacher;
    return {
      classes: [{ students: students, teachers: teachers }],
      total: participantListOrigin.usersConnection?.totalCount,
      next: { teacher: teacherNext, student: studentNext },
      hash: { teacher: teacherHash, student: studentHash },
    };
  }
);

export const getClassesBySchool = createAsyncThunk("getClassesBySchool", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data } = await gqlapi.query<MySchoolIDsQuery, MySchoolIDsQueryVariables>({
    query: MySchoolIDsDocument,
    variables: { organization_id },
  });
  if (data?.me?.membership?.schoolMemberships?.length) {
    return Promise.all(
      data?.me?.membership?.schoolMemberships?.map(async (item) => {
        const { data } = await gqlapi.query<ClassesBySchoolQuery, ClassesBySchoolQueryVariables>({
          query: ClassesBySchoolDocument,
          variables: {
            school_id: item?.school_id as string,
          },
        });
        return data?.school?.classes;
      })
    );
  }
});

type feedbackSchedulesParams = Parameters<typeof api.schedules.getScheduleNewestFeedbackByOperator>[0];
type feedbackSchedulesResult = ReturnType<typeof api.schedules.getScheduleNewestFeedbackByOperator>;
export const getScheduleNewetFeedback = createAsyncThunk<feedbackSchedulesResult, feedbackSchedulesParams>(
  "schedule/feedback",
  (schedule_id) => {
    return api.schedules.getScheduleNewestFeedbackByOperator(schedule_id);
  }
);

type deleteSchedulesParams = {
  schedule_id: Parameters<typeof api.schedules.deleteSchedule>[0];
  repeat_edit_options: Parameters<typeof api.schedules.deleteSchedule>[1];
};
type deleteSchedulesResult = ReturnType<typeof api.schedules.deleteSchedule>;
export const removeSchedule = createAsyncThunk<deleteSchedulesResult, deleteSchedulesParams>(
  "schedule/delete",
  ({ schedule_id, repeat_edit_options }, query) => {
    return api.schedules.deleteSchedule(schedule_id, repeat_edit_options);
  }
);

type infoSchedulesParams = Parameters<typeof api.schedules.getScheduleById>[0];
type infoSchedulesResult = ReturnType<typeof api.schedules.getScheduleById>;
export const getScheduleInfo = createAsyncThunk<infoSchedulesResult, infoSchedulesParams>("schedule/info", (schedule_id, query) => {
  return api.schedules.getScheduleById(schedule_id);
});

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = ReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);

type ScheduleShowOptionParams = {
  schedule_id: Parameters<typeof api.schedules.updateScheduleShowOption>[0];
  show_option: Parameters<typeof api.schedules.updateScheduleShowOption>[1];
};
type ScheduleShowOptionResult = ReturnType<typeof api.schedules.updateScheduleShowOption>;
export const scheduleShowOption = createAsyncThunk<ScheduleShowOptionResult, ScheduleShowOptionParams>(
  "updateScheduleShowOption",
  ({ schedule_id, show_option }) => {
    return api.schedules.updateScheduleShowOption(schedule_id, show_option);
  }
);

type getScheduleNewestFeedbackParams = {
  schedule_id: Parameters<typeof api.schedules.getScheduleNewestFeedbackByOperator>[0];
} & LoadingMetaPayload;
type getScheduleNewestFeedbackResult = ReturnType<typeof api.schedules.getScheduleNewestFeedbackByOperator>;
export const getScheduleNewestFeedback = createAsyncThunk<getScheduleNewestFeedbackResult, getScheduleNewestFeedbackParams>(
  "schedule/getScheduleNewestFeedback",
  ({ schedule_id }) => {
    return api.schedules.getScheduleNewestFeedbackByOperator(schedule_id);
  }
);

export const saveScheduleFeedback = createAsyncThunk<
  ApiSuccessRequestResponse,
  EntityScheduleFeedbackAddInput & LoadingMetaPayload,
  { state: Rootstate }
>("schedules_feedbacks", async (payload, { getState }) => {
  return api.schedulesFeedbacks.addScheduleFeedback(payload);
});

type UpdateStatusResourseParams = {
  schedule_id: Parameters<typeof api.schedules.updateStatus>[0];
  status: Parameters<typeof api.schedules.updateStatus>[1];
};
type UpdateStatusResourseResult = ReturnType<typeof api.schedules.updateStatus>;
export const scheduleUpdateStatus = createAsyncThunk<UpdateStatusResourseResult, UpdateStatusResourseParams>(
  "content/getContentResourceUploadPath",
  ({ schedule_id, status }) => {
    return api.schedules.updateStatus(schedule_id, status);
  }
);

export const ScheduleFilterPrograms = createAsyncThunk("schedule/filterPrograms", () => {
  return api.schedulesFilter.getProgramsInScheduleFilter();
});

interface ScheduleFilterSubjectParams extends LoadingMetaPayload {
  program_id: string;
}
type ScheduleFilterSubjectResult = ReturnType<typeof api.schedulesFilter.getSubjectsInScheduleFilter>;
export const ScheduleFilterSubject = createAsyncThunk<ScheduleFilterSubjectResult, ScheduleFilterSubjectParams>(
  "schedule/filterSubject",
  ({ program_id }) => {
    return api.schedulesFilter.getSubjectsInScheduleFilter({ program_id: program_id });
  }
);

export interface getScheduleParticipantsPayLoad extends LoadingMetaPayload {
  class_id: string;
}
export interface getScheduleParticipantsMockOptionsResponse {
  participantList: ParticipantsByClassQuery;
}

export interface getProgramsChildPayLoad extends LoadingMetaPayload {
  program_id: string;
}
export interface getProgramsChildResponse {
  programChildInfo: GetProgramsQuery;
}

export interface EntityClassType {
  id?: string;
  name?: string;
}

export interface getScheduleMockOptionsResponse {
  teacherList: TeachersByOrgnizationQuery;
  subjectList: LinkedMockOptionsItem[];
  programList: LinkedMockOptionsItem[];
  classTypeList: EntityClassType[];
}
interface GetScheduleMockOptionsPayLoad {
  organization_id?: string | null;
  teacher_id?: string;
}

export interface getScheduleMockOptionsAllSettledResponse {
  teacherList: TeachersByOrgnizationQuery;
  subjectList: LinkedMockOptionsItem[];
  programList: LinkedMockOptionsItem[];
}

/**
 * get schedule option
 */
export const getScheduleMockOptions = createAsyncThunk<getScheduleMockOptionsAllSettledResponse, GetScheduleMockOptionsPayLoad>(
  "getClassesList",
  async () => {
    const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
    const { data } = await gqlapi.query<TeachersByOrgnizationQuery, TeachersByOrgnizationQueryVariables>({
      query: TeachersByOrgnizationDocument,
      variables: {
        organization_id,
      },
    });
    const mockResult: TeachersByOrgnizationQuery = teacherListByOrg;
    const teacherList = MOCK ? mockResult : data;

    const programList = await programsHandler.getProgramsOptions();
    const _subjectList = await programsHandler.getAllSubjects();
    return { subjectList: uniqBy(_subjectList, "id"), programList, teacherList };
  }
);

type SubjectResourseResult = ReturnType<typeof api.subjects.getSubject>;
export const getSubjectByProgramId = createAsyncThunk<SubjectResourseResult, { program_id: string } & LoadingMetaPayload>(
  "getSubject",
  async (program_id) => {
    return api.subjects.getSubject(program_id);
  }
);

/**
 * get participant
 */
export const getScheduleParticipant = createAsyncThunk<getScheduleParticipantsMockOptionsResponse, getScheduleParticipantsPayLoad>(
  "getParticipant",
  async ({ class_id }) => {
    const { data } = await gqlapi.query<GetClassByInfoQuery, GetClassByInfoQueryVariables>({
      query: GetClassByInfoDocument,
      variables: {
        filter: { id: { operator: UuidOperator.Eq, value: class_id } },
        direction: ConnectionDirection.Forward,
        studentFilter: { organizationUserStatus: { operator: StringOperator.Eq, value: "active" } },
        teacherFilter: { organizationUserStatus: { operator: StringOperator.Eq, value: "active" } },
      },
    });
    const participantList: {
      class: { teachers: { user_id: string; user_name: string }[]; students: { user_id: string; user_name: string }[] };
    } = { class: { teachers: [], students: [] } };
    const studentsConnection = data?.classesConnection?.edges![0]?.node?.studentsConnection?.edges;
    const teachersConnection = data?.classesConnection?.edges![0]?.node?.teachersConnection?.edges;
    studentsConnection?.forEach((student) => {
      if (student?.node?.status === "active")
        participantList.class.students.push({
          user_id: student.node?.id as string,
          user_name: student.node?.givenName + " " + student.node?.familyName,
        });
    });
    teachersConnection?.forEach((teacher) => {
      if (teacher?.node?.status === "active")
        participantList.class.teachers.push({
          user_id: teacher.node?.id as string,
          user_name: teacher.node?.givenName + " " + teacher.node?.familyName,
        });
    });
    return { participantList };
  }
);

type GetContentsAuthedParams = Parameters<typeof api.contentsAuthed.queryAuthContent>[0];
type GetContentsAuthedResult = ReturnType<typeof api.contentsAuthed.queryAuthContent>;
export const getContentsAuthed = createAsyncThunk<GetContentsAuthedResult, GetContentsAuthedParams>("getContentsAuthed", async (query) => {
  return api.contentsAuthed.queryAuthContent({ ...query });
});

// contentEdit搜索contentlist
type IQueryContentsParams = Parameters<typeof api.contents.searchContents>[0] & LoadingMetaPayload;
type IQueryContentsResult = AsyncReturnType<typeof api.contents.searchContents>;
export const searchAuthContentLists = createAsyncThunk<IQueryContentsResult, IQueryContentsParams>(
  "searchAuthContentLists",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.contentsAuthed.queryAuthContent({ page_size: 10, ...query });
    return { list, total };
  }
);

interface LiveSchedulePayload extends LoadingMetaPayload {
  schedule_id: Parameters<typeof api.schedules.getScheduleLiveToken>[0];
  live_token_type: "preview" | "live";
}
type LiveScheduleResult = ReturnType<typeof api.schedules.getScheduleLiveToken>;
export const getScheduleLiveToken = createAsyncThunk<LiveScheduleResult, LiveSchedulePayload>(
  "schedule/live",
  // @ts-ignore
  async ({ schedule_id, live_token_type }) => {
    return api.schedules.getScheduleLiveToken(schedule_id, { live_token_type: live_token_type }).catch((err) => Promise.reject(err.label));
  }
);

export const getMockOptions = createAsyncThunk("mock/options", async () => {
  return apiGetMockOptions();
});

export const getSchoolByUser = createAsyncThunk("getSchoolByUser", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  const { data: meInfo } = await gqlapi.query<QeuryMeQuery, QeuryMeQueryVariables>({
    query: QeuryMeDocument,
    variables: {
      organization_id,
    },
  });
  return gqlapi.query<SchoolByUserQueryQuery, SchoolByUserQueryQueryVariables>({
    query: SchoolByUserQueryDocument,
    variables: {
      user_id: meInfo.me?.user_id as string,
      organization_id: organization_id,
    },
  });
});

export const getSchoolsFilterList = createAsyncThunk<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables & LoadingMetaPayload>(
  "getSchoolsFilterList",
  // @ts-ignore
  ({ filter, direction, directionArgs }) => {
    return gqlapi.query<GetSchoolsFilterListQuery, GetSchoolsFilterListQueryVariables>({
      query: GetSchoolsFilterListDocument,
      variables: {
        filter: filter,
        direction: direction,
        directionArgs: directionArgs,
      },
    });
  }
);

export const getClassFilterList = createAsyncThunk<GetClassFilterListQuery, GetClassFilterListQueryVariables & LoadingMetaPayload>(
  "getClassFilterList",
  // @ts-ignore
  ({ filter, direction, directionArgs }) => {
    return gqlapi.query<GetClassFilterListQuery, GetClassFilterListQueryVariables>({
      query: GetClassFilterListDocument,
      variables: {
        filter: filter,
        direction: direction,
        directionArgs: directionArgs,
      },
    });
  }
);

export const getSchoolByOrg = createAsyncThunk("getSchoolByOrg", async () => {
  const organization_id = ((await apiWaitForOrganizationOfPage()) as string) || "";
  return gqlapi.query<SchoolByOrgQueryQuery, SchoolByOrgQueryQueryVariables>({
    query: SchoolByOrgQueryDocument,
    variables: {
      organization_id: organization_id,
    },
  });
});

interface GetScheduleViewInfoParams extends LoadingMetaPayload {
  schedule_id: Parameters<typeof api.schedulesView.getSchedulePopupById>[0];
}
type GetScheduleViewInfoResult = ReturnType<typeof api.schedulesView.getSchedulePopupById>;
export const getScheduleViewInfo = createAsyncThunk<GetScheduleViewInfoResult, GetScheduleViewInfoParams>(
  "getScheduleViewInfo",
  async ({ schedule_id }) => {
    return api.schedulesView.getSchedulePopupById(schedule_id);
  }
);

type IQueryOutcomeListParams = Parameters<typeof api.publishedLearningOutcomes.searchPublishedLearningOutcomes>[0] & LoadingMetaPayload;
type IQueryOutcomeListResult = AsyncReturnType<typeof api.publishedLearningOutcomes.searchPublishedLearningOutcomes>;
export const actOutcomeList = createAsyncThunk<IQueryOutcomeListResult, IQueryOutcomeListParams>(
  "publishedLearningOutcomes/searchPublishedLearningOutcomes",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.publishedLearningOutcomes.searchPublishedLearningOutcomes(query);
    return { list, total, page: query.page };
  }
);
type IQueryactOutcomeListLoadingParams = Parameters<typeof api.learningOutcomes.searchLearningOutcomes>[0] & LoadingMetaPayload;
export const actOutcomeListLoading = createAsyncThunk<IQueryOutcomeListResult, IQueryactOutcomeListLoadingParams>(
  "outcome/outcomeList",
  async ({ metaLoading, ...query }) => {
    const { list, total } = await api.publishedLearningOutcomes.searchPublishedLearningOutcomes(query);
    return { list, total, page: query.page };
  }
);

interface LinkedMockOptions {
  developmental?: LinkedMockOptionsItem[];
  skills?: LinkedMockOptionsItem[];
}
export const getLinkedMockOptions = createAsyncThunk<LinkedMockOptions, LoadingMetaPayload>("content/getLinkedMockOptions", async () => {
  const [developmental, skills] = await Promise.all([api.developmentals.getDevelopmental(), api.skills.getSkill()]);
  return { developmental, skills };
});

const { actions, reducer } = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetScheduleDetial: (state, { payload }: PayloadAction<ScheduleState["scheduleDetial"]>) => {
      state.scheduleDetial = payload;
    },
    resetParticipantList: (state) => {
      state.participantMockOptions = {
        participantList: {
          class: {
            teachers: [],
            students: [],
          },
        },
      };
    },
    changeParticipants: (state, { payload }: PayloadAction<ChangeParticipants>) => {
      payload.type === "classRoster" ? (state.classRosterIds = payload.data) : (state.participantsIds = payload.data);
    },
    resetScheduleTimeViewData: (state, { payload }: PayloadAction<ScheduleState["scheduleTimeViewData"]>) => {
      state.scheduleTimeViewData = payload;
    },
    resetActOutcomeList: (state, { payload }: PayloadAction<any>) => {
      state.outcomeList = payload;
    },
    resetParticipantsData: (state) => {
      state.ParticipantsData = {
        classes: {
          students: [],
          teachers: [],
        },
        total: 0,
        hash: {
          teacher: "",
          student: "",
        },
        next: {
          teacher: false,
          student: false,
        },
      };
    },
  },
  extraReducers: {
    [actOutcomeListLoading.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeListInit = payload.list;
    },
    [actOutcomeList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.outcomeList = payload.page > 1 ? [...state.outcomeList, ...payload.list] : payload.list;
      state.outcomeTotal = payload.total;
    },
    [getSearchScheduleList.fulfilled.type]: (state, { payload }: any) => {
      state.searchScheduleList = payload.data;
      state.total = payload.total;
    },
    [saveScheduleData.fulfilled.type]: (state, { payload }: any) => {
      if (payload.label !== "schedule_msg_users_conflict") state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [getScheduleTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleTimeViewData = payload.data;
      state.scheduleTimeViewTotal = payload.total;
    },
    [getScheduleTimeViewDataByYear.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleTimeViewYearData = payload;
    },
    [removeSchedule.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = initScheduleDetial;
    },
    [removeSchedule.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [getScheduleInfo.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
    [getContentResourceUploadPath.fulfilled.type]: (state, { payload }: any) => {
      state.attachment_path = payload.path;
      state.attachement_id = payload.resource_id;
    },
    [getScheduleLiveToken.fulfilled.type]: (state, { payload }: any) => {
      state.liveToken = payload.token;
    },
    [getScheduleLiveToken.rejected.type]: (state, { error }: any) => {
      state.liveToken = "";
    },
    [getMockOptions.fulfilled.type]: (state, { payload }: any) => {
      state.mockOptions = payload;
    },
    [getScheduleMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleMockOptions>>) => {
      state.scheduleMockOptions.subjectList = payload.subjectList;
      state.scheduleMockOptions.programList = payload.programList;
      state.scheduleMockOptions.teacherList = payload.teacherList;
    },
    [getScheduleParticipant.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getScheduleParticipant>>) => {
      state.participantMockOptions = payload;
    },
    [getContentsAuthed.fulfilled.type]: (state, { payload }: any) => {
      state.contentsAuthList = payload.list;
    },
    [getClassesByTeacher.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListTeacher = { user: payload.data.user.membership };
    },
    [getClassesByStudent.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListStudent = { user: payload.data.user.membership };
    },
    [getClassesByOrg.fulfilled.type]: (state, { payload }: any) => {
      state.classOptions.classListOrg = payload.data;
    },
    [getClassesBySchool.fulfilled.type]: (state, { payload }: any) => {
      let result: any = [];
      payload?.forEach((item: any) => {
        result = [...result, ...item];
      });
      const reduceTemporaryStorage: { [class_id: string]: boolean } = {};
      result = [...result].reduce<any>((item, next) => {
        if (next !== null)
          if (!reduceTemporaryStorage[next.class_id as string] && next.class_id) {
            item.push(next);
            reduceTemporaryStorage[next.class_id as string] = true;
          }
        return item;
      }, []);
      state.classOptions.classListSchool = { school: { classes: result } };
    },
    [getParticipantsData.fulfilled.type]: (state, { payload }: any) => {
      let teachers: RolesData[] = [...state.ParticipantsData.classes.teachers];
      let students: RolesData[] = [...state.ParticipantsData.classes.students];
      payload?.classes.forEach((item: ClassesData) => {
        teachers = teachers.concat(item.teachers);
        students = students.concat(item.students);
      });
      state.ParticipantsData = { classes: { students, teachers }, total: payload?.total, next: payload?.next, hash: payload?.hash };
    },
    [getScheduleNewetFeedback.fulfilled.type]: (state, { payload }: any) => {
      state.feedbackData = payload;
    },
    [getSubjectByProgramId.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleMockOptions.subjectList = payload ? payload : [{ id: "5e9a201e-9c2f-4a92-bb6f-1ccf8177bb71", name: "None Specified" }];
    },
    [ScheduleFilterPrograms.fulfilled.type]: (state, { payload }: any) => {
      state.filterOption.programs = payload;
    },
    [getScheduleAnyTimeViewData.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleAnyTimeViewData = payload;
    },
    [getSchoolByUser.fulfilled.type]: (state, { payload }: any) => {
      state.schoolByOrgOrUserData = payload.data.user.membership?.schoolMemberships.map((item: any) => {
        return item.school;
      });
    },
    [getSchoolByOrg.fulfilled.type]: (state, { payload }: any) => {
      state.schoolByOrgOrUserData = payload.data.organization?.schools;
    },
    [searchAuthContentLists.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.mediaList = payload.list;
    },
    [getScheduleViewInfo.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.ScheduleViewInfo = payload;
    },
    [getProgramChild.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.programChildInfo = payload;
    },
    [getLinkedMockOptions.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.developmental = payload.developmental;
      state.skills = payload.skills;
    },
    [getSchoolsFilterList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.schoolsConnection = payload.data;
    },
    [getClassFilterList.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.classesConnection = payload.data;
    },
    [classesWithoutSchool.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.filterOtherClasses = payload.data;
    },
    [getLessonPlansBySchedule.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.lessonPlans = payload;
    },
    [getUserInUndefined.fulfilled.type]: (state, { payload }: PayloadAction<any>) => {
      state.userInUndefined = payload.data;
    },
  },
});
export const {
  resetScheduleDetial,
  resetParticipantList,
  changeParticipants,
  resetScheduleTimeViewData,
  resetActOutcomeList,
  resetParticipantsData,
} = actions;
export default reducer;
