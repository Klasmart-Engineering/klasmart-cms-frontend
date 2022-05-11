import { BooleanOperator, ConnectionDirection, StringOperator, UuidOperator } from "@api/api-ko-schema.auto";
import { apiGetUserNameByUserId, apiWaitForOrganizationOfPage } from "@api/extra";
import { AssessmentTypeValues } from "@components/AssessmentType";
import { DetailAssessmentProps } from "@pages/DetailAssessment/type";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api, { gqlapi } from "../api";
import {
  GetRolesIdDocument,
  GetRolesIdQuery,
  GetRolesIdQueryVariables,
  GetUsersByNameDocument,
  GetUsersByNameQuery,
  GetUsersByNameQueryVariables,
  QueryMyUserDocument,
  QueryMyUserQuery,
  QueryMyUserQueryVariables
} from "../api/api-ko.auto";
import { EntityScheduleFeedbackView } from "../api/api.auto";
import { ListAssessmentResult, ListAssessmentResultItem, OrderByAssessmentList } from "../api/type";
import {
  AssessmentListResult,
  AssessmentStatus,
  AssessmentStatusValues, UserEntity
} from "../pages/ListAssessment/types";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";
import { AsyncReturnType, AsyncTrunkReturned } from "./type";

export interface IAssessmentState {
  my_id?: string;
  total: ListAssessmentResult["total"];
  assessmentList: ListAssessmentResultItem[];
  homefunFeedbacks: EntityScheduleFeedbackView[];
  hasPermissionOfHomefun: boolean | undefined;
  assessmentListV2: AssessmentListResult;
  assessmentDetailV2: DetailAssessmentProps;
  attachment_path: string;
  attachment_id: string;
  teacherList: UserEntity[] | undefined;
}

// interface RootState {
//   assessments: IAssessmentState;
// }

const initialState: IAssessmentState = {
  total: undefined,
  assessmentList: [],
  homefunFeedbacks: [],
  hasPermissionOfHomefun: false,
  my_id: "",
  assessmentListV2: [],
  assessmentDetailV2: {},
  attachment_path: "",
  attachment_id: "",
  teacherList: undefined,
};

type IQueryAssessmentV2Params = Parameters<typeof api.assessmentsV2.queryAssessmentV2>[0] & LoadingMetaPayload;
type IQueryAssessmentV2Result = AsyncReturnType<typeof api.assessmentsV2.queryAssessmentV2>;
export const getAssessmentListV2 = createAsyncThunk<IQueryAssessmentV2Result, IQueryAssessmentV2Params>(
  "assessments/getAssessmentListV2",
  async ({ metaLoading, ...query }) => {
    const { status, assessment_type, order_by, query_key, query_type, page, page_size } = query;
    const isStudy = assessment_type === AssessmentTypeValues.study;
    const isReview = assessment_type === AssessmentTypeValues.review;
    const isHomefun = assessment_type === AssessmentTypeValues.homeFun;
    let _status: string = "";
    let _order_by: IQueryAssessmentV2Params["order_by"];
    if (isStudy || isReview || isHomefun) {
      _order_by = order_by ? order_by : OrderByAssessmentList._create_at;
      _status =
        status === AssessmentStatus.all
          ? AssessmentStatusValues.study_all
          : status === AssessmentStatus.in_progress
          ? AssessmentStatusValues.study_inprogress
          : AssessmentStatusValues.complete;
    } else {
      _order_by = order_by ? order_by : OrderByAssessmentList._class_end_time;
      _status =
        status === AssessmentStatus.all
          ? AssessmentStatusValues.class_live_homefun_all
          : status === AssessmentStatus.in_progress
          ? AssessmentStatusValues.class_live_homefun_inprogress
          : AssessmentStatusValues.complete;
    }
    const _query = {
      assessment_type,
      page,
      page_size,
      status: _status,
      order_by: _order_by,
      query_key: query_key ? query_key : " ",
      query_type: query_key ? query_type : undefined,
    };
    const { assessments, total } = await api.assessmentsV2.queryAssessmentV2({ ..._query, page_size: 20 });
    return { assessments, total };
  }
);
type IQueryDetailAssessmentResult = {
  detail: DetailAssessmentProps;
  my_id: string;
};
export const getDetailAssessmentV2 = createAsyncThunk<IQueryDetailAssessmentResult, { id: string } & LoadingMetaPayload>(
  "assessments/getDetailAssessmentV2",
  async ({ id }) => {
    // 拉取我的user_id
    const {
      data: { myUser },
    } = await gqlapi.query<QueryMyUserQuery, QueryMyUserQueryVariables>({
      query: QueryMyUserDocument,
    });
    const my_id = myUser?.node?.id || "";
    const res = await api.assessmentsV2.getAssessmentDetailV2(id);
    const detail: DetailAssessmentProps = { ...res };
    const { teacher_ids, students, diff_content_students } = detail;
    const teacherIds = teacher_ids || [];
    const studentIds = diff_content_students
      ? diff_content_students.map((item) => item.student_id!) || []
      : students?.map((item) => item.student_id!) || [];
    const userNamesArr = await apiGetUserNameByUserId(teacherIds.concat(studentIds));
    detail.teachers = teacher_ids?.map((item) => {
      const name = userNamesArr.get(item!);
      return {
        id: item,
        name,
      }
    });
    detail.students = diff_content_students
      ? diff_content_students.map((item) => {
          item.student_name = userNamesArr.get(item.student_id!);
          return item;
        })
      : detail.students?.map((item) => {
          item.student_name = userNamesArr.get(item.student_id!);
          return item;
        });
    return { detail, my_id };
  }
);

export const getUserListByName = createAsyncThunk<UserEntity[] | undefined, string>("assessments/getUserListByName", async (name) => {
  if (!name) return undefined;
  const { data: roleData } = await gqlapi.query<GetRolesIdQuery, GetRolesIdQueryVariables>({
    query: GetRolesIdDocument,
    variables: {
      direction: ConnectionDirection.Forward,
      directionArgs: { count: 10 },
      filter: { system: { operator: BooleanOperator.Eq, value: true } },
    },
  });
  let teacherRoleId = "";
  roleData.rolesConnection?.edges?.forEach((item) => {
    if (item?.node?.name === "Teacher") {
      teacherRoleId = item.node.id;
    }
  });
  const orgId = (await apiWaitForOrganizationOfPage()) as string;
  const filter = {
    filter: {
      roleId: {
        operator: UuidOperator.Eq,
        value: teacherRoleId,
      },
      organizationId: {
        operator: UuidOperator.Eq,
        value: orgId,
      },
      OR: [
        {
          familyName: {
            operator: StringOperator.Contains,
            value: name,
            caseInsensitive: true,
          },
        },
        {
          givenName: {
            operator: StringOperator.Contains,
            value: name,
            caseInsensitive: true,
          },
        },
      ],
    },
    directionArgs: {
      count: 15,
    },
  };
  const {
    data: { usersConnection },
  } = await gqlapi.query<GetUsersByNameQuery, GetUsersByNameQueryVariables>({
    query: GetUsersByNameDocument,
    variables: filter,
  });
  const teacherList = usersConnection?.edges?.map((item) => {
    return {
      id: item?.node?.id as string,
      name: `${item?.node?.givenName} ${item?.node?.familyName}` as string,
    };
  });
  return teacherList;
});
type IQueryUpdateAssessmentParams = {
  id: Parameters<typeof api.assessmentsV2.updateAssessmentV2>[0];
  data: Parameters<typeof api.assessmentsV2.updateAssessmentV2>[1];
};
export const updateAssessmentV2 = createAsyncThunk<string, IQueryUpdateAssessmentParams>(
  "assessments/updateAssessment",
  async ({ id, data }) => {
    await api.assessmentsV2.updateAssessmentV2(id, data);
    return id;
  }
);

type IGetContentsResourseParams = Parameters<typeof api.contentsResources.getContentResourceUploadPath>[0];
type IGetContentsResourseResult = AsyncReturnType<typeof api.contentsResources.getContentResourceUploadPath>;
export const getContentResourceUploadPath = createAsyncThunk<IGetContentsResourseResult, IGetContentsResourseParams>(
  "content/getContentResourceUploadPath",
  (query) => {
    return api.contentsResources.getContentResourceUploadPath(query);
  }
);
const { reducer } = createSlice({
  name: "assessments",
  initialState,
  reducers: {},
  extraReducers: {
    [getDetailAssessmentV2.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getDetailAssessmentV2>>) => {
      state.assessmentDetailV2 = payload.detail;
      state.my_id = payload.my_id;
    },
    [getDetailAssessmentV2.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getDetailAssessmentV2>>) => {
      state.assessmentDetailV2 = initialState.assessmentDetailV2;
      state.my_id = initialState.my_id;
    },
    [getAssessmentListV2.fulfilled.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessmentListV2>>) => {
      state.assessmentListV2 = payload.assessments ?? [];
      state.total = payload.total;
    },
    [getAssessmentListV2.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getAssessmentListV2>>) => {
      state.assessmentListV2 = initialState.assessmentListV2;
      state.total = initialState.total;
    },
    [getContentResourceUploadPath.fulfilled.type]: (state, { payload }: any) => {
      state.attachment_path = payload.path;
      state.attachment_id = payload.resource_id;
    },
    [getUserListByName.fulfilled.type]: (state, { payload }: any) => {
      state.teacherList = payload;
    },
    [getUserListByName.pending.type]: (state, { payload }: PayloadAction<AsyncTrunkReturned<typeof getUserListByName>>) => {
      state.teacherList = initialState.teacherList;
    },
    [getUserListByName.rejected.type]: (state, {payload}: any) => {
      // user service bug修好后 删掉
      state.teacherList = [];
    },
  },
});

export default reducer;
