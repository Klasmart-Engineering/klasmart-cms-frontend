import { IconButton } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { ChevronLeft, ChevronRight, FirstPage, LastPage } from "@mui/icons-material";
import React from "react";
import { t } from "../../locale/LocaleManager";
const useStyles = makeStyles(() =>
  createStyles({
    pagination: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
  })
);

interface IPagination {
  rowsPerPage?: number;
  page: number;
  count: number;
  onChangePage: (page: number) => any;
}

export default function ReportPagination(props: IPagination) {
  const { page, count, rowsPerPage = 10, onChangePage } = props;
  const css = useStyles();
  const lastPage = (page - 1) * rowsPerPage + rowsPerPage > count ? count : (page - 1) * rowsPerPage + rowsPerPage;
  return (
    <div className={css.pagination}>
      <span style={{ marginRight: 6, fontSize: 14, color: "rgba(0, 0, 0, 0.54)" }}>
        {t("report_student_usage_of", { total: count, value: `${(page - 1) * rowsPerPage + 1}-${lastPage}` })}
      </span>
      <IconButton onClick={() => onChangePage(1)} disabled={page === 1}>
        <FirstPage />
      </IconButton>
      <IconButton onClick={() => onChangePage(page - 1)} disabled={page === 1}>
        <ChevronLeft />
      </IconButton>
      <IconButton onClick={() => onChangePage(page + 1)} disabled={page === Math.ceil(count / rowsPerPage) || count === 0}>
        <ChevronRight />
      </IconButton>
      <IconButton
        onClick={() => onChangePage(Math.ceil(count / rowsPerPage))}
        disabled={page === Math.ceil(count / rowsPerPage) || count === 0}
      >
        <LastPage />
      </IconButton>
    </div>
  );
}
