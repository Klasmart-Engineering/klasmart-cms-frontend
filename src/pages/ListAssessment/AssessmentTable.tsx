import { AssessmentTypeValues } from "@components/AssessmentType";
import { createStyles, makeStyles, Table, TableBody, TableCell, TableContainer, TableRow, Tooltip } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo } from "react";
import LayoutBox from "../../components/LayoutBox";
import { PLTableHeader } from "../../components/PLTable";
import { d } from "../../locale/LocaleManager";
import { formattedDate, formattedTime } from "../../models/ModelContentDetailForm";
import { assessmentHeader } from "./computed";
import { AssessmentListResult, AssessmentQueryCondition, AssessmentStatus } from "./types";

const useStyles = makeStyles((theme) =>
  createStyles({
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
      marginTop: 30,
    },
    tableCell: {
      width: 115,
      minWidth: 104,
      maxWidth: 200,
    },
    nameListCell: {
      maxWidth: 300,
    },
    statusCell: {
      width: 115,
      minWidth: 104,
      maxWidth: 115,
    },
    statusCon: {
      color: "#fff",
      borderRadius: "15px",
      height: 26,
      lineHeight: "26px",
      textAlign: "center",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      padding: "0 5px",
    },
    completeColor: {
      backgroundColor: "#1aa21e",
    },
    inCompleteColor: {
      backgroundColor: "#f1c621",
    },
  })
);

interface AssessmentProps {
  assessment: AssessmentListResult[0];
  onClickAssessment: AssessmentTableProps["onClickAssessment"];
  assessmentType: AssessmentQueryCondition["assessment_type"];
}
function AssessmentRow(props: AssessmentProps) {
  const css = useStyles();
  const { assessment, onClickAssessment, assessmentType } = props;
  const isComplete = assessment.status === AssessmentStatus.complete;
  const statusText = isComplete ? d("Complete").t("assess_filter_complete") : d("Incomplete").t("assess_filter_in_progress");
  const isLong = useMemo(() => {
    if (statusText.length > 16) {
      return true;
    } else {
      return false;
    }
  }, [statusText.length]);
  const statusCom = <div className={clsx(css.statusCon, isComplete ? css.completeColor : css.inCompleteColor)}>{statusText}</div>;
  const isClassAndLive = useMemo(() => {
    return assessmentType === AssessmentTypeValues.class || assessmentType === AssessmentTypeValues.live;
  }, [assessmentType]);
  const isStudy = useMemo(() => {
    return assessmentType === AssessmentTypeValues.study;
  }, [assessmentType]);
  const isReview = useMemo(() => {
    return assessmentType === AssessmentTypeValues.review;
  }, [assessmentType]);
  const isHomefun = useMemo(() => {
    return assessmentType === AssessmentTypeValues.homeFun;
  }, [assessmentType]);
  return (
    <TableRow onClick={(e) => onClickAssessment(assessment.id)}>
      <TableCell className={css.tableCell} align="center">
        {assessment.title ?? d("N/A").t("assess_column_n_a")}
      </TableCell>
      {!isReview && !isHomefun && <TableCell align="center">{assessment.lesson_plan?.name}</TableCell>}
      {isClassAndLive && (
        <>
          <TableCell align="center">{assessment.subjects?.map((v) => v.name).join(", ")}</TableCell>
          <TableCell align="center">{assessment.program?.name}</TableCell>
          <TableCell align="center" className={css.statusCell}>
            {isLong ? (
              <Tooltip title={statusText} placement="top">
                {statusCom}
              </Tooltip>
            ) : (
              statusCom
            )}
          </TableCell>
        </>
      )}
      <TableCell align="center" className={css.nameListCell}>
        {assessment.teachers?.map((v) => v.name)?.join(" ,") ?? d("N/A").t("assess_column_n_a")}
      </TableCell>
      {isClassAndLive && <TableCell align="center">{formattedTime(assessment.class_end_at)}</TableCell>}
      {!isClassAndLive && <TableCell align="center">{assessment.class_info?.name ?? d("N/A").t("assess_column_n_a")}</TableCell>}
      {isHomefun && (
        <TableCell align="center" className={css.statusCell}>
          {isLong ? (
            <Tooltip title={statusText} placement="top">
              {statusCom}
            </Tooltip>
          ) : (
            statusCom
          )}
        </TableCell>
      )}
      {!isClassAndLive && (
        <>
          {/* <TableCell align="center">{assessment.class_info?.name ?? d("N/A").t("assess_column_n_a")}</TableCell> */}
          <TableCell align="center">
            {assessment.due_at ? formattedDate(assessment.due_at) : d("N/A").t("assess_column_n_a")}
          </TableCell>
          <TableCell align="center">
            {assessment?.complete_rate ? `${Math.round(assessment?.complete_rate * 100)}%` : d("N/A").t("assess_column_n_a")}
          </TableCell>
        </>
      )}
      {(isStudy || isHomefun) && (
        <TableCell align="center">
          {assessment.remaining_time
            ? `${Math.ceil(assessment.remaining_time / 60 / 60 / 24)} ${d("Day(s)").t("assess_list_remaining_days")}`
            : 0}
        </TableCell>
      )}
      {!isReview && <TableCell align="center">{formattedTime(assessment.complete_at)}</TableCell>}
    </TableRow>
  );
}

export interface AssessmentTableProps {
  total: number;
  list: AssessmentListResult;
  queryCondition: AssessmentQueryCondition;
  onChangePage: (page: number) => void;
  onClickAssessment: (id: string | undefined) => any;
}
export function AssessmentTable(props: AssessmentTableProps) {
  const css = useStyles();
  const {
    queryCondition: { assessment_type, page },
    total,
    list,
    onChangePage,
    onClickAssessment,
  } = props;
  const amountPerPage = 20;
  const header = assessmentHeader(assessment_type);
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      <TableContainer>
        <Table>
          <PLTableHeader fields={header} style={{ height: 80, width: "100%" }} />
          <TableBody>
            {list.map((item) => (
              <AssessmentRow key={item.id} assessment={item} assessmentType={assessment_type} onClickAssessment={onClickAssessment} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        page={page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
