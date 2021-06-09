import { Box, Collapse, makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import React from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { EntityAssessmentStudentViewH5PItem } from "../../api/api.auto";
import noDataIconUrl from "../../assets/icons/any_time_no_data.png";
import { d } from "../../locale/LocaleManager";
import { UpdateAssessmentRequestDataOmitAction, UpdateStudyAssessmentDataOmitAction } from "../../models/ModelAssessment";
import { AppDispatch } from "../../reducers";
import { actWarning } from "../../reducers/notify";
import { dynamicTableName, ElasticLayerControl } from "../../types/assessmentTypes";
import ResourcesView from "./ResourcesView";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "16px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#F2F5F7 !important",
    },
    "& div": {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      "& a": {
        fontSize: "14px",
        color: "#006CCF",
      },
    },
  },
  emptyBox: {
    textAlign: "center",
    "& img": {
      width: "60%",
      marginTop: "6%",
    },
  },
  scoreEditBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  outcomesBox: {
    maxWidth: "260px",
    "& li": {
      textAlign: "left",
      marginTop: "10px",
    },
  },
});

interface BasicTableProps extends tableProps {
  handleElasticLayerControl: (elasticLayerControlData: ElasticLayerControl) => void;
  studentViewItem: EntityAssessmentStudentViewH5PItem;
  index: number;
}

interface EditScoreProps {
  score?: number;
  handleChangeScore: (score?: number, indexSub?: number) => void;
  index: number;
  editable?: boolean;
  isSubjectiveActivity: boolean;
  maxScore?: number;
  attempted?: boolean;
  isComplete?: boolean;
  is_h5p?: boolean;
}

function EditScore(props: EditScoreProps) {
  const { score, handleChangeScore, index, editable, isSubjectiveActivity, maxScore, attempted, isComplete, is_h5p } = props;
  const [scoreNum, setScoreNum] = React.useState<number | string | undefined>(score);
  const dispatch = useDispatch<AppDispatch>();
  const classes = useStyles();
  return (
    <div className={classes.scoreEditBox}>
      {attempted ? (
        <>
          {editable && !isComplete && isSubjectiveActivity ? (
            <>
              <TextField
                style={{ width: "59px", transform: "scale(0.8)" }}
                value={scoreNum}
                id="standard-size-small"
                size="small"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = (e.target.value as unknown) as number;
                  if (value! > maxScore!) {
                    dispatch(actWarning(d("The score you entered cannot exceed the maximum score.").t("assess_msg_exceed_maximum")));
                  } else if (Number(value) + "" !== NaN + "") {
                    const computerValue = String(value).replace(/^(.*\..{1}).*$/, "$1");
                    handleChangeScore(Number(computerValue), index);
                    setScoreNum(computerValue);
                  }
                }}
              />{" "}
              / {maxScore}
            </>
          ) : (
            <>
              {scoreNum} / {maxScore}
            </>
          )}
        </>
      ) : is_h5p ? (
        d("Not Attempted").t("assess_option_not_attempted")
      ) : (
        ""
      )}
    </div>
  );
}

function BasicTable(props: BasicTableProps) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState(false);

  const {
    handleElasticLayerControl,
    studentViewItem,
    formMethods: { control, setValue, getValues },
    index,
    editable,
    isComplete,
    tableCellData,
    name,
    tableType,
  } = props;

  const handleChangeComment = (commentText: string) => {
    const attendance_ids = getValues() as {
      student_ids: string[];
      [name]: EntityAssessmentStudentViewH5PItem[];
    };
    setValue(`${name}[${index}]`, {
      ...attendance_ids[name][index],
      comment: commentText,
    });
    handleElasticLayerControl({ openStatus: false, type: "" });
  };

  const handleChangeScore = (score?: number, indexSub?: number) => {
    const attendance_ids = getValues() as {
      student_ids: string[];
      [name]: EntityAssessmentStudentViewH5PItem[];
    };
    const lesson_materials = attendance_ids[name][index].lesson_materials?.map((materials, idx) => {
      return idx === indexSub ? { ...materials, achieved_score: score } : materials;
    });
    setValue(`${name}[${index}]`, {
      ...attendance_ids[name][index],
      lesson_materials: lesson_materials,
    });
  };

  const subjectiveActivity = (type?: string) => {
    return ["Essay"].includes(type ?? "");
  };

  const reBytesStr = (str: string, len: number) => {
    let bytesNum = 0;
    let afterCutting = "";
    for (let i = 0, lens = str.length; i < lens; i++) {
      bytesNum += str.charCodeAt(i) > 255 ? 2 : 1;
      if (bytesNum > len) break;
      afterCutting = str.substring(0, i + 1);
    }
    return bytesNum > len ? `${afterCutting} ....` : afterCutting;
  };

  const textEllipsis = (value?: string) => {
    const CharacterCount = 36;
    return value ? reBytesStr(value, CharacterCount) : "";
  };

  const showCommentsElement = () => {
    return studentViewItem.lesson_materials?.some((lesson) => lesson.lesson_material_type !== "");
  };

  return (
    <Controller
      name={`${name}[${index}]`}
      control={control}
      defaultValue={studentViewItem || []}
      render={({ ref, ...props }) => (
        <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
          <Box
            className={classes.tableBar}
            style={{ backgroundColor: checked ? "#F2F5F7" : "white" }}
            onClick={() => {
              setChecked(!checked);
            }}
          >
            <div style={{ color: checked ? "black" : "#666666" }}>
              <AccountCircleIcon />
              <span style={{ padding: "0 18px 0 18px" }}>{studentViewItem.student_name}</span>
              {editable && !isComplete && showCommentsElement() && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElasticLayerControl({
                      openStatus: true,
                      type: "AddComment",
                      contentText: studentViewItem.comment,
                      handleChangeComment: handleChangeComment,
                      title: d("Add Comments").t("assess_popup_add_comments"),
                    });
                  }}
                  style={{ display: checked ? "block" : "none", color: "rgb(0, 108, 207)" }}
                >
                  {d("Click to add comments").t("assess_detail_click_to_add_comments")}
                </span>
              )}
              {isComplete && showCommentsElement() && studentViewItem.comment && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleElasticLayerControl({
                      openStatus: true,
                      type: "DetailView",
                      contentText: studentViewItem.comment,
                      title: d("View Comments").t("assess_popup_view_comments"),
                    });
                  }}
                  style={{ display: checked ? "block" : "none", color: "rgb(0, 108, 207)" }}
                >
                  {d("Click to view comments").t("assess_detail_click_to_view_comments")}
                </span>
              )}
            </div>
            {checked && <ArrowDropUpIcon />}
            {!checked && <ArrowDropDownIcon />}
          </Box>
          <Collapse in={checked}>
            <Paper elevation={4}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {tableCellData.map((cell, index) => (
                      <TableCell align="center" key={index}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentViewItem?.lesson_materials?.map((row, index) => (
                    <TableRow key={row.lesson_material_id}>
                      <TableCell component="th" scope="row" align="center">
                        {index + 1}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={row.lesson_material_name as string} placement="top-start">
                          <span>{textEllipsis(row.lesson_material_name)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">{row.lesson_material_type}</TableCell>
                      <TableCell align="center">
                        <p
                          style={{
                            color: "#006CCF",
                            cursor: "pointer",
                            display: subjectiveActivity(row.lesson_material_type) ? "block" : "none",
                          }}
                          onClick={() => {
                            handleElasticLayerControl({
                              openStatus: true,
                              type: "DetailView",
                              contentText: row.answer,
                              title: d("Detailed Answer").t("assess_popup_detailed_answer"),
                            });
                          }}
                        >
                          {d("Click to View").t("assess_detail_click_to_view")}
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        <EditScore
                          score={row.achieved_score}
                          maxScore={row.max_score}
                          handleChangeScore={handleChangeScore}
                          index={index}
                          editable={editable}
                          isSubjectiveActivity={subjectiveActivity(row.lesson_material_type)}
                          attempted={row.attempted}
                          is_h5p={row.is_h5p}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {tableType === "study" && (
                          <>{row?.max_score! === 0 ? "" : Math.ceil((row?.achieved_score! / row?.max_score!) * 100) + "%"}</>
                        )}
                        {tableType === "live" && (
                          <ul className={classes.outcomesBox}>
                            {row?.outcome_names?.map((name) => (
                              <li>{name}</li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableContainer>
      )}
    />
  );
}

interface tableProps {
  studentViewItems?: EntityAssessmentStudentViewH5PItem[];
  formMethods: UseFormMethods<UpdateStudyAssessmentDataOmitAction>;
  formValue?: UpdateAssessmentRequestDataOmitAction;
  editable?: boolean;
  isComplete: boolean;
  tableCellData: string[];
  name: dynamicTableName;
  tableType: "live" | "study";
}

export function DynamicTable(props: tableProps) {
  const { studentViewItems, formMethods, formValue, editable, isComplete, tableCellData, name, tableType } = props;
  const [elasticLayerControlData, setElasticLayerControlData] = React.useState<ElasticLayerControl>({
    openStatus: false,
    type: "",
  });
  const handleElasticLayerControl = (elasticLayerControlData: ElasticLayerControl) => {
    setElasticLayerControlData(elasticLayerControlData);
  };
  const classes = useStyles();
  return (
    <>
      {studentViewItems?.map((item: EntityAssessmentStudentViewH5PItem, index: number) => {
        return (
          <BasicTable
            key={item.student_id}
            handleElasticLayerControl={handleElasticLayerControl}
            studentViewItem={item}
            formMethods={formMethods}
            index={index}
            formValue={formValue}
            editable={editable}
            isComplete={isComplete}
            tableCellData={tableCellData}
            name={name}
            tableType={tableType}
          />
        );
      })}
      {(!studentViewItems || !studentViewItems.length) && (
        <div className={classes.emptyBox}>
          <img alt="empty" src={noDataIconUrl} />
        </div>
      )}
      <ResourcesView elasticLayerControlData={elasticLayerControlData} handleElasticLayerControl={handleElasticLayerControl} />
    </>
  );
}