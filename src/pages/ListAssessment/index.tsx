import { usePermission } from "@hooks/usePermission";
import useQueryCms from "@hooks/useQueryCms";
import { DetailAssessment } from "@pages/DetailAssessment";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, ExectSeachType, OrderByAssessmentList } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getAssessmentListV2, getUserListByName } from "../../reducers/assessments";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { AssessmentQueryCondition, SearchListForm } from "./types";

const useQuery = (): AssessmentQueryCondition => {
  const { page, querys } = useQueryCms();
  const assessment_type = querys.get("assessment_type") || AssessmentTypeValues.live;
  const query_type = (querys.get("query_type") as ExectSeachType) || ExectSeachType.all;
  const query_key = querys.get("query_key") || "";
  const isStudy =
    assessment_type === AssessmentTypeValues.study ||
    assessment_type === AssessmentTypeValues.review ||
    assessment_type === AssessmentTypeValues.homeFun;
  const defaultOrderBy = isStudy ? OrderByAssessmentList._create_at : OrderByAssessmentList._class_end_time;
  const order_by = (querys.get("order_by") as OrderByAssessmentList) || defaultOrderBy;
  const status = (querys.get("status") as AssessmentStatus) || AssessmentStatus.all;
  const teacher_name = querys.get("teacher_name") as string || ""; 
  return useMemo(() => {
    return { ...clearNull({ query_key, status, page, order_by, query_type, teacher_name }), assessment_type };
  }, [query_key, status, page, order_by, query_type, teacher_name, assessment_type]);
};
export function ListAssessment() {
  const perm = usePermission([
    PermissionType.report_learning_summary_org_652,
    PermissionType.report_learning_summary_school_651,
    PermissionType.report_learning_summary_teacher_650,
    PermissionType.report_learning_summary_student_649,
    PermissionType.view_completed_assessments_414,
    PermissionType.view_in_progress_assessments_415,
    PermissionType.view_org_completed_assessments_424,
    PermissionType.view_org_in_progress_assessments_425,
    PermissionType.view_school_completed_assessments_426,
    PermissionType.view_school_in_progress_assessments_427,
  ]);
  const isPending = useMemo(() => perm.view_completed_assessments_414 === undefined, [perm.view_completed_assessments_414]);
  const hasPerm =
    perm.view_completed_assessments_414 ||
    perm.view_in_progress_assessments_415 ||
    perm.view_org_completed_assessments_424 ||
    perm.view_org_in_progress_assessments_425 ||
    perm.view_school_completed_assessments_426 ||
    perm.view_school_in_progress_assessments_427;

  const { assessmentListV2, total, teacherList } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const condition = useQuery();
  const formMethods = useForm<SearchListForm>();
  const { reset } = formMethods;
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    history.push({ search: toQueryString(value) });
  };
  const handleChangeAssessmentType: SecondSearchHeaderProps["onChangeAssessmentType"] = (assessment_type) => {
    reset();
    history.push(`/assessments/assessment-list?assessment_type=${assessment_type}&status=${AssessmentStatus.all}&page=1&query_key=${condition.query_key}&query_type=${condition.query_type}&teacher_name=${condition.teacher_name}`);
  };
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page?: number) =>
    history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id?: string) => {
    history.push({ pathname: DetailAssessment.routeBasePath, search: toQueryString({ id, assessment_type: condition.assessment_type }) });
  };
  const handleSearchTeacherName: SecondSearchHeaderProps["onSearchTeacherName"] = (name) => {
    dispatch(getUserListByName(name))
  }
  useEffect(() => {
    dispatch(getAssessmentListV2({ ...condition, metaLoading: true }));
  }, [condition, dispatch]);
  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader
            value={condition}
            formMethods={formMethods}
            teacherList={teacherList}
            onChange={handleChange}
            onChangeAssessmentType={handleChangeAssessmentType}
            onSearchTeacherName={handleSearchTeacherName}
          />
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : assessmentListV2 && assessmentListV2.length > 0 ? (
          <AssessmentTable
            queryCondition={condition}
            list={assessmentListV2}
            total={total || 0}
            onChangePage={handleChangePage}
            onClickAssessment={handleClickAssessment}
          />
        ) : (
          emptyTip
        )
      ) : (
        permissionTip
      )}
    </>
  );
}
// ListAssessment.routeBasePath = "/assessments/list";
// ListAssessment.routeRedirectDefault = `/assessments/list?assessment_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&page=1`;

ListAssessment.routeBasePath = "/assessments/assessment-list";
ListAssessment.routeRedirectDefault = `/assessments/assessment-list?assessment_type=${AssessmentTypeValues.live}&status=${AssessmentStatus.all}&page=1`;
