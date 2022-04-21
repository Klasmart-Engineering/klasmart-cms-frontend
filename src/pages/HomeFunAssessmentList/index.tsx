import useQueryCms from "@hooks/useQueryCms";
import { clearNull, toQueryString } from "@utilities/urlUtilities";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import PermissionType from "../../api/PermissionType";
import { AssessmentStatus, HomeFunAssessmentOrderBy, HomeFunAssessmentStatus } from "../../api/type";
import { FirstSearchHeader, FirstSearchHeaderMb } from "../../components/AssessmentFirsetHearder/FirstSearchHeader";
import { AssessmentTypeValues } from "../../components/AssessmentType";
import { emptyTip, permissionTip } from "../../components/TipImages";
import { useRole } from "../../hooks/usePermission";
import { AppDispatch, RootState } from "../../reducers";
import { actHomeFunAssessmentList } from "../../reducers/assessments";
import { AssessmentsHomefunEdit } from "../HomefunEdit";
import { AssessmentTable, AssessmentTableProps } from "./AssessmentTable";
import { SecondSearchHeader, SecondSearchHeaderProps } from "./SecondSearchHeader";
import { ThirdSearchHeader, ThirdSearchHeaderMb } from "./ThirdSearchHeader";
import { HomeFunAssessmentQueryCondition } from "./types";

const PAGE_SIZE = 20;
const useQuery = (): HomeFunAssessmentQueryCondition => {
  const { querys, page, query_type, query_key } = useQueryCms();
  const status = querys.get("status") || HomeFunAssessmentStatus.all;
  const order_by = (querys.get("order_by") as HomeFunAssessmentOrderBy | null) || HomeFunAssessmentOrderBy._submit_at;
  return useMemo(() => {
    return clearNull({ query_key, query_type, status, page, order_by });
  }, [query_key, query_type, status, page, order_by]);
};
export function HomeFunAssessmentList() {
  const condition = useQuery();
  const history = useHistory();
  const { homeFunAssessmentList, total } = useSelector<RootState, RootState["assessments"]>((state) => state.assessments);
  const { isPending, hasPerm } = useRole();
  const dispatch = useDispatch<AppDispatch>();
  const handleChangePage: AssessmentTableProps["onChangePage"] = (page) => history.push({ search: toQueryString({ ...condition, page }) });
  const handleChangeAssessmentType = (assessmentType: AssessmentTypeValues) => {
    if (assessmentType === AssessmentTypeValues.homeFun) {
      history.push(`/assessments/home-fun?status=${HomeFunAssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`);
    } else {
      history.push(`/assessments/assessment-list?assessment_type=${assessmentType}&status=${AssessmentStatus.all}&page=1`);
    }
  };
  const handleClickAssessment: AssessmentTableProps["onClickAssessment"] = (id) => {
    history.push({ pathname: AssessmentsHomefunEdit.routeBasePath, search: toQueryString({ id }) });
  };
  const handleChange: SecondSearchHeaderProps["onChange"] = (value) => history.push({ search: toQueryString(value) });
  useEffect(() => {
    dispatch(actHomeFunAssessmentList({ ...condition, page_size: PAGE_SIZE, metaLoading: true }));
  }, [condition, dispatch]);

  return (
    <>
      <FirstSearchHeader />
      <FirstSearchHeaderMb />
      {!isPending && hasPerm && (
        <>
          <SecondSearchHeader value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
          {/* <SecondSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} /> */}
          <ThirdSearchHeader value={condition} onChange={handleChange} />
          <ThirdSearchHeaderMb value={condition} onChange={handleChange} onChangeAssessmentType={handleChangeAssessmentType} />
        </>
      )}
      {isPending ? (
        ""
      ) : hasPerm ? (
        total === undefined ? (
          ""
        ) : homeFunAssessmentList && homeFunAssessmentList.length > 0 ? (
          <AssessmentTable
            list={homeFunAssessmentList}
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

// HomeFunAssessmentList.routeBasePath = "/assessments/home-fun";
// HomeFunAssessmentList.routeRedirectDefault = `/assessments/home-fun?status=${HomeFunAssessmentStatus.all}&order_by=${HomeFunAssessmentOrderBy._submit_at}&page=1`;
HomeFunAssessmentList.routeBasePath = "/assessments/homefunlist";
HomeFunAssessmentList.routeRedirectDefault = `/assessments/homefunlist?assessment_type=${AssessmentTypeValues.homeFun}order_by=${HomeFunAssessmentOrderBy._submit_at}&status=${AssessmentStatus.all}&page=1`;
