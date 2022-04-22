import { useRole } from "@hooks/usePermission";
import useQueryCms from "@hooks/useQueryCms";
import { DetailAssessment } from "@pages/DetailAssessment";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AssessmentStatus, ExectSeachType, OrderByAssessmentList } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getAssessmentListV2 } from "../../reducers/assessments";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { AssessmentQueryCondition, SearchListForm } from "./types";

const useQuery = (): AssessmentQueryCondition => {
  const { query_key, page, querys } = useQueryCms();
  const assessment_type = querys.get("assessment_type") || AssessmentTypeValues.live;
  const query_type = (querys.get("query_type") as ExectSeachType) || ExectSeachType.all;
  const isStudy =
    assessment_type === AssessmentTypeValues.study ||
    assessment_type === AssessmentTypeValues.review ||
    assessment_type === AssessmentTypeValues.homeFun;
  const defaultOrderBy = isStudy ? OrderByAssessmentList._create_at : OrderByAssessmentList._class_end_time;
  const order_by = (querys.get("order_by") as OrderByAssessmentList) || defaultOrderBy;
  const status = (querys.get("status") as AssessmentStatus) || AssessmentStatus.all;
  return useMemo(() => {
    return { ...clearNull({ query_key, status, page, order_by, query_type }), assessment_type };
  }, [query_key, status, page, order_by, query_type, assessment_type]);
};
export function ListAssessment() {
  const { isPending, hasPerm } = useRole();
  const { assessmentListV2, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
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
    history.push(`/assessments/assessment-list?assessment_type=${assessment_type}&status=${AssessmentStatus.all}&page=1`);
  };
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page?: number) =>
    history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id?: string) => {
    history.push({ pathname: DetailAssessment.routeBasePath, search: toQueryString({ id, assessment_type: condition.assessment_type }) });
  };
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
            onChange={handleChange}
            onChangeAssessmentType={handleChangeAssessmentType}
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
