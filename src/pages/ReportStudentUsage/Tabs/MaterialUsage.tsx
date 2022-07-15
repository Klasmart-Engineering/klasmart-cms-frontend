// 9-15 14:22
import { Box, Grid, IconButton } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import clsx from "clsx";
import { sortBy } from "lodash";
import moment, { Moment } from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EntityContentUsage } from "../../../api/api.auto";
import MutiSelect from "../../../components/MutiSelect";
import { d, t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";
import { getStudentUsageMaterial } from "../../../reducers/report";
import ClassFilter from "../components/ClassFilter";
import MaterialUsageTooltip from "../components/MaterialUsageTooltip";
import useTranslation from "../hooks/useTranslation";
const useStyles = makeStyles(() =>
  createStyles({
    material: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    selected: {
      padding: "24px 0",
      display: "flex",
      justifyContent: "flex-end",
    },
    total: {
      marginBottom: "14px",
      "&>span": {
        fontSize: "20px",
        fontFamily: "Helvetica, Helvetica-Bold",
        fontWeight: 700,
      },
    },
    tableContainer: {
      borderBottom: "1px solid #e9e9e9",
      "&:nth-child(1) .datumContainer": {
        paddingTop: "30px",
      },
      "&:last-child": {
        "& .datumContainer": {
          paddingBottom: "30px",
        },
      },
    },
    dataBlock: {
      display: "flex",
      alignItems: "flex-start",
    },
    blockRight: {
      wordBreak: "break-all",
      marginBottom: "16px",
      maxWidth: "180px",
    },
    point: {
      height: "12px",
      width: "12px",
      minWidth: "12px",
      maxWidth: "12px",
      marginTop: "6px",
      marginRight: "16px",
      borderRadius: "50%",
    },
    blockCount: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "16px",
    },
    lineFooter: {
      display: "flex",
      justifyContent: "space-around",
      borderTop: "1px solid #e9e9e9",
      padding: "40px 0",
    },
    viewedAmount: {},
    tableItem: {
      color: "#999",
      "&:hover": {
        color: "#000",
        fontWeight: "bold",
      },
    },
    date: {
      alignSelf: "flex-end",
      color: "#999",
      width: "30%",
      display: "flex",
      textAlign: "right",
      paddingTop: "13px",
      paddingBottom: "13px",
    },
    chartTitle: {
      width: "160px",
      color: "#999",
    },
    dateList: {},
    tableIItemLabel: {
      fontSize: 16,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      width: "10%",
    },
    tableData: {
      position: "relative",
      width: "90%",
    },
    tableDatum: {
      height: "28px",
      transition: "ease 400ms",
      marginRight: "2px",
    },
    datumContainer: {
      flex: 1,
      display: "flex",
      height: "28px",
      marginLeft: "10px",
      padding: "20px 0",
      borderLeft: "1px solid #e9e9e9",
      position: "relative",
    },
    datumWrapper: {
      flex: 1,
      display: "flex",
      position: "absolute",
    },
    pagination: {
      border: "none",
      "& .MuiTablePagination-toolbar": {
        "& .MuiTablePagination-input": {
          display: "none",
        },
        "& .MuiTablePagination-caption": {
          display: "none",
        },
      },
    },
    paginationLabel: {
      whiteSpace: "nowrap",
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.54)",
    },
  })
);

const PAGE_SIZE = 5;

const colors = ["#0062FF", "#408AFF", "#73A9FF", "#A6C9FF", "#E6EFFF"];

export const sortViewTypes = (list: EntityContentUsage[]): EntityContentUsage[] => {
  const sortTemplate = ["h5p", "image", "video", "audio", "document"];
  const result: EntityContentUsage[] = [];
  list
    .filter((item) => item)
    .forEach((item) => {
      const sortIndex = sortTemplate.indexOf(item.type as string);
      if (sortIndex > -1) {
        result[sortIndex] = item;
      }
    });
  return result;
};
const computeTimestamp = (month: Moment, now?: boolean): string => {
  if (now) {
    return month.clone().set("D", 1).unix().valueOf() + "-" + moment().unix().valueOf();
  }
  return month.clone().set("D", 1).unix().valueOf() + "-" + month.clone().add(1, "M").set("D", 1).unix().valueOf();
};

const momentRef = moment().locale("en").set("h", 0).set("s", 0).set("minute", 0);
export default function MaterialUsage() {
  const style = useStyles();
  const dispatch = useDispatch();
  const pageRef = useRef(0);
  const { allValue, viewType, months, MaterialUsageConData } = useTranslation();
  const [contentTypeList, setContentTypeList] = useState<string[]>([]);
  const [classIdList, setClassIdList] = useState<{ label: string; value: string }[]>([]);
  const contentTypeListRef = useRef(contentTypeList);
  const classIdListRef = useRef(classIdList);
  const [timeRangeList] = useState<Moment[]>([momentRef.clone().subtract(2, "M"), momentRef.clone().subtract(1, "M"), momentRef]);
  const [page, setPage] = useState(pageRef.current);
  const [transferredData, setTransferredDate] = useState<Map<string, EntityContentUsage[]>[]>([]);
  const { studentUsageReport } = useSelector<RootState, RootState["report"]>((state) => state.report);
  const [ids, setIds] = useState<string[]>([]);
  const [totalView, setTotalView] = useState(0);

  useEffect(() => {
    const result: Map<string, EntityContentUsage[]>[] = [];
    const idList: string[] = [];
    studentUsageReport[0]?.class_usage_list?.forEach((item) => {
      const data = new Map<string, EntityContentUsage[]>();
      const sortData = sortBy(item.content_usage_list, (a) => Number(a.time_range?.split("-")[0]));
      sortData.forEach((pItem) => {
        data.set(pItem.time_range as string, sortViewTypes([...(data.get(pItem.time_range as string) ?? []), pItem]));
      });
      result.push(data);
      idList.push(item.id as string);
    });
    setTransferredDate(result);
    setIds(idList);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentUsageReport[0]]);

  useEffect(() => {
    const viewAmount =
      studentUsageReport[1].content_usage_list?.reduce((preV, item) => {
        return preV + Number(item.count ?? 0);
      }, 0) ?? 0;
    setTotalView(viewAmount);
  }, [studentUsageReport]);

  const getClassesList = () => {
    return classIdListRef.current.map((item) => item.value);
  };

  const getList = () => {
    const class_id_list = getClassesList().slice(pageRef.current * PAGE_SIZE, pageRef.current * PAGE_SIZE + PAGE_SIZE);
    if (!class_id_list.length) {
      return;
    }
    dispatch(
      getStudentUsageMaterial({
        metaLoading: true,
        class_id_list,
        allClasses: getClassesList(),
        content_type_list: !contentTypeListRef.current.length
          ? MaterialUsageConData.filter((item) => item.value !== allValue).map((item) => item.value)
          : contentTypeListRef.current,
        time_range_list: [computeTimestamp(timeRangeList[0]), computeTimestamp(timeRangeList[1]), computeTimestamp(timeRangeList[2], true)],
        time_range_count: [timeRangeList[0].clone().set("D", 1).unix().valueOf() + "-" + moment().unix().valueOf()],
      })
    );
  };

  const handleChange = (
    value: {
      label: string;
      value: string;
    }[]
  ) => {
    pageRef.current = 0;
    setPage(0);
    setContentTypeList(value.map((item) => item.value));
    contentTypeListRef.current = value.map((item) => item.value);
    getList();
  };

  const handleClass = (value: { label: string; value: string }[]) => {
    pageRef.current = 0;
    setPage(0);
    setClassIdList(value);
    classIdListRef.current = value;
    getList();
  };

  const renderLineFooterBlock = (content: string, count: number, index: number) => {
    return (
      <div className={style.dataBlock} key={index}>
        <div className={style.point} style={{ background: colors[index] }}></div>
        <div className={style.blockRight}>
          {content}
          <div className={style.blockCount}>{count}</div>
        </div>
      </div>
    );
  };

  const renderTableItem = (datum: Map<string, EntityContentUsage[]>, index: number, maxValue: number) => {
    return (
      <Grid container item className={style.tableItem} key={index}>
        <Grid item className={style.tableIItemLabel}>
          {classIdList.find((item) => item.value === ids[index])?.label}
        </Grid>
        <Grid item container className={style.tableData}>
          {Array.from(datum.values()).map((item, index) => {
            const monthAmount = item.reduce((preValue, value) => preValue + Number(value.count), 0);
            return (
              <div className={clsx(style.datumContainer, "datumContainer")} key={index}>
                <MaterialUsageTooltip content={item} key={index}>
                  <div className={style.datumWrapper} style={{ width: (monthAmount / maxValue) * 100 + "%" }}>
                    {item.map((datumType, dIndex) => {
                      const count = Number(datumType.count);
                      return (
                        <div
                          key={dIndex}
                          className={style.tableDatum}
                          style={{
                            width: (Number(datumType.count) ? (Number(datumType.count) / monthAmount) * 100 : 0) + "%",
                            background: colors[dIndex],
                            marginRight: count === 0 ? 0 : undefined,
                          }}
                        />
                      );
                    })}
                  </div>
                </MaterialUsageTooltip>
              </div>
            );
          })}
        </Grid>
      </Grid>
    );
  };

  const renderBarChart = () => {
    const allCount: number[] = [];
    transferredData.forEach((item) => {
      Array.from(item.values()).forEach((pItem) => {
        allCount.push(pItem.reduce((pValue, v) => Number(v.count) + pValue, 0));
      });
    });
    const maxValue = Math.max(...allCount);
    return (
      <>
        <Grid container wrap={"nowrap"} direction={"column"} className={style.tableContainer}>
          {transferredData.map((item, index) => {
            return renderTableItem(item, index, maxValue);
          })}
        </Grid>
      </>
    );
  };

  const TablePaginationActions = () => {
    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = 0;
      setPage(pageRef.current);
      getList();
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page - 1 <= 0 ? 0 : page - 1;
      setPage(pageRef.current);
      getList();
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      pageRef.current = page + 1 > getClassesList().length ? getClassesList().length : page + 1;
      setPage(pageRef.current);
      getList();
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const countPages = Math.ceil(getClassesList().length / 5) - 1;
      pageRef.current = countPages;
      setPage(pageRef.current);
      getList();
    };

    return (
      <Grid container wrap={"nowrap"} justifyContent={"center"} alignItems={"center"}>
        <label className={style.paginationLabel}>
          {t("report_student_usage_of", {
            total: `${getClassesList().length}`,
            value: `${page * 5 + 1}-${page * 5 + 5 > getClassesList().length ? getClassesList().length : page * 5 + 5}`,
          })}
        </label>
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
          <FirstPageIcon />
        </IconButton>
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(getClassesList().length / 5) - 1} aria-label="next page">
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(getClassesList().length / 5) - 1}
          aria-label="last page"
        >
          <LastPageIcon />
        </IconButton>
      </Grid>
    );
  };

  return (
    <div className={style.material}>
      <div className={style.selected}>
        <ClassFilter onChange={handleClass} />
      </div>
      <Grid container className={style.total}>
        <span>
          {d("Content total viewed (latest 3 months)").t("report_content_total_viewed")}：{totalView}
        </span>
      </Grid>
      <Grid container justifyContent={"flex-end"} className={style.total}>
        <Box
          style={{
            position: "relative",
            width: 180,
            height: 50,
          }}
        >
          <MutiSelect options={MaterialUsageConData} label={t("report_filter_content")} onChange={handleChange} defaultValueIsAll />
        </Box>
      </Grid>
      {renderBarChart()}
      <Grid container justifyContent={"flex-end"}>
        <Grid item container justifyContent={"center"} className={style.date}>
          {months[timeRangeList[0].format("MMMM")]}
        </Grid>
        <Grid item container justifyContent={"center"} className={style.date}>
          {months[timeRangeList[1].format("MMMM")]}
        </Grid>
        <Grid item container justifyContent={"center"} className={style.date}>
          {months[timeRangeList[2].format("MMMM")]}
        </Grid>
      </Grid>
      <Grid container direction={"column"} className={style.viewedAmount}>
        <Grid item className={style.lineFooter}>
          {sortViewTypes(Object.keys(viewType).map((item) => ({ type: item } as EntityContentUsage))).map((key, index) => {
            const findType = (studentUsageReport[1].content_usage_list || []).filter((item) => item).find((item) => item.type === key.type);
            if (findType) {
              return renderLineFooterBlock(viewType[findType.type as string], findType.count as number, index);
            }
            return renderLineFooterBlock(viewType[key.type as string], 0, index);
          })}
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} item>
        {TablePaginationActions()}
      </Grid>
    </div>
  );
}
