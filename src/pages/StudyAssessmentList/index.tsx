import { useRole } from "@hooks/usePermission";
import useQueryCms from "@hooks/useQueryCms";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import produce from "immer";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AssessmentOrderBy, AssessmentStatus, ExectSeachType, HomeFunAssessmentOrderBy, StudyAssessmentOrderBy } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { AppDispatch, RootState } from "../../reducers";
import { getStudyAssessmentList } from "../../reducers/assessments";
import { AssessmentDetail } from "../AssesmentDetail";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderMb, SecondSearchHeaderProps } from "./SecondSearchHearder";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHearder";
import { SearchListForm, SearchListFormKey, StudyAssessmentQueryCondition } from "./types";

const useQuery = (): StudyAssessmentQueryCondition => {
  const { querys, page } = useQueryCms();
  const order_by = (querys.get("order_by") as StudyAssessmentOrderBy | null) || undefined;
  const status = (querys.get("status") as AssessmentStatus | null) || undefined;
  const query_type = querys.get("query_type") || ExectSeachType.all;
  const query = querys.get("query") || "";
  return useMemo(() => {
    return clearNull({ query, status, page, order_by, query_type });
  }, [query, status, page, order_by, query_type]);
};
export function StudyAssessmentList() {
  const { isPending, hasPerm } = useRole();
  const condition = useQuery();
  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>();
  const formMethods = useForm<SearchListForm>();
  const { getValues } = formMethods;
  const { studyAssessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => {
    const searchText = getValues()[SearchListFormKey.SEARCH_TEXT];
    const exectSearch = getValues()[SearchListFormKey.EXECT_SEARCH];
    const newValue = produce(value, (draft) => {
      searchText ? (draft.query = searchText) : delete draft.query;
      draft.query_type = exectSearch;
    });
    history.push({ search: toQueryString(newValue) });
  };
  const handleChangeAssessmentType = (assessmentType: AssessmentTypeValues) => {
    if (assessmentType === AssessmentTypeValues.live || assessmentType === AssessmentTypeValues.class) {
      history.push(
        `/assessments/assessment-list?class_type=${assessmentType}&status=${AssessmentStatus.all}&order_by=${AssessmentOrderBy._class_end_time}&page=1`
      );
    }
    if (assessmentType === AssessmentTypeValues.homeFun) {
      history.push(`/assessments/home-fun?status=${AssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`);
    }
    if (assessmentType === AssessmentTypeValues.study) {
      history.push(`/assessments/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._create_at}&page=1`);
    }
  };
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: AssessmentDetail.routeBasePath, search: toQueryString({ id }) });
  };
  useEffect(() => {
    dispatch(getStudyAssessmentList({ ...condition, metaLoading: true }));
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
          <SecondSearchHeaderMb
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
        ) : studyAssessmentList && studyAssessmentList[0] ? (
          <AssessmentTable
            list={studyAssessmentList}
            total={total as number}
            queryCondition={condition}
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

StudyAssessmentList.routeBasePath = "/assessments/study";
StudyAssessmentList.routeRedirectDefault = `/assessments/study?status=${AssessmentStatus.all}&order_by=${StudyAssessmentOrderBy._create_at}&page=1`;
