import {
  Checkbox,
  createStyles,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CheckBox, CheckBoxOutlineBlank } from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import DoneIcon from "@material-ui/icons/Done";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Pagination } from "@material-ui/lab";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import PermissionType from "../../api/PermissionType";
import { GetOutcomeDetail, OutcomePublishStatus } from "../../api/type";
import { CheckboxGroup, CheckboxGroupContext } from "../../components/CheckboxGroup";
import LayoutBox from "../../components/LayoutBox";
import { LButton } from "../../components/LButton";
import { Permission } from "../../components/Permission/Permission";
import { d } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { formatTimeToEng } from "../../models/ModelReports";
import { isUnpublish } from "./ThirdSearchHeader";
import { BulkListForm, BulkListFormKey, OutcomeQueryCondition } from "./types";
const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);
const useStyles = makeStyles((theme) =>
  createStyles({
    iconColor: {
      color: "#D32F2F",
      padding: "0 0 0 10px",
    },
    approveIconColor: {
      color: "#4CAF50",
      padding: "0 0 0 10px",
    },
    rePublishColor: {
      color: "#0E78D5",
      padding: "0 0 0 10px",
    },
    pagination: {
      marginBottom: 40,
    },
    paginationUl: {
      justifyContent: "center",
      marginTop: 30,
    },
    checkbox: {
      padding: 0,
      borderRadius: 5,
      backgroundColor: "white",
    },
    tableHead: {
      height: 80,
      backgroundColor: "#f2f5f7",
    },
    tableCell: {
      textAlign: "center",
      maxWidth: 200,
      wordWrap: "break-word",
      wordBreak: "normal",
    },
    outcomeSet: {
      overflow: "hidden",
      display: "-webkit-box",
      textOverflow: "ellipsis",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      maxHeight: 93,
    },
    liCon: {
      textAlign: "left",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      listStylePosition: "inside",
    },
    disableTableRow: {
      "& td": {
        color: "rgba(0, 0, 0, 0.26)",
        backgroundColor: "transparent",
      },
    },
    disableTableCell: {
      position: "relative",
      zIndex: 100,
      color: "rgba(0, 0, 0, 0.26)",
      backgroundColor: "transparent",
    },
    disableBtn: {
      opacity: 0.6,
      filter: "alpha(opacity=60)",
      pointerEvents: "none",
      cursor: "default",
    },
    lockWrap: {
      position: "absolute",
      top: 0,
      left: 0,
    },
    trapezoidCon: {
      width: "27px",
      borderTop: "3px solid #d8e9f8",
      borderLeft: "2px solid #fff",
      borderRight: "2px solid #fff",
      height: 0,
    },
    lockCon: {
      width: 0,
      height: 0,
      borderTop: "22px solid #d8e9f8",
      borderLeft: "13.5px solid #d8e9f8",
      borderRight: "13.5px solid #d8e9f8",
      borderBottom: "5px solid #fff",
      textAlign: "center",
      borderRadius: "1px",
      position: "absolute",
      marginTop: 1,
      marginLeft: 2,
    },
    lockTitle: {
      fontWeight: 700,
    },
    lockInfoWrap: {
      fontSize: 14,
      height: 28,
      lineHeight: "28px",
      color: "#000",
    },
    lockIcon: {
      fontSize: 16,
      color: "#0f78d5",
      position: "absolute",
      top: -20,
      left: -8,
    },
    lightGrayColor: {
      color: "#666",
    },
  })
);

const stopPropagation =
  <T extends React.MouseEvent, R = void>(handler?: (arg: T) => R) =>
  (e: T) => {
    e.stopPropagation();
    if (handler) return handler(e);
  };

interface OutcomeProps extends OutcomeActionProps {
  outcome: GetOutcomeDetail;
  queryCondition: OutcomeQueryCondition;
  selectedContentGroupContext: CheckboxGroupContext;
  onClickOutcome: OutcomeTableProps["onClickOutcome"];
  userId: string;
}
function OutomeRow(props: OutcomeProps) {
  const css = useStyles();
  const { outcome, queryCondition, selectedContentGroupContext, onDelete, onClickOutcome, userId, onApprove, onReject } = props;
  const { registerChange, hashValue } = selectedContentGroupContext;
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    registerChange(e);
  };
  const isLocked = !!(outcome.locked_by && outcome.locked_by !== "-");
  const score_threshold = outcome.score_threshold ? Math.floor(outcome.score_threshold * 100) : 0;
  return (
    <TableRow className={isLocked ? css.disableTableRow : ""} onClick={(e) => onClickOutcome(outcome.outcome_id)}>
      <TableCell
        onClick={stopPropagation()}
        className={isLocked ? css.disableTableCell : ""}
        style={{ width: 100 }}
        align="center"
        padding="checkbox"
      >
        {isLocked && (
          <LightTooltip
            title={
              <>
                <div className={clsx(css.lockInfoWrap, css.lockTitle)}>{d("Lock Status").t("assess_in_lock_status")}</div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Last edited by").t("assess_last_edited_by")}: </span>
                  <span className={css.lightGrayColor}>{outcome.last_edited_by}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Locked location").t("assess_locked_location")}: </span>
                  <span className={css.lightGrayColor}>{outcome.locked_location?.join(",")}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Date edited").t("assess_date_edited")}: </span>
                  <span className={css.lightGrayColor}>{formatTimeToEng(outcome.last_edited_at as number, "date")}</span>
                </div>
                <div className={css.lockInfoWrap}>
                  <span>{d("Time edited").t("assess_time_edited")}: </span>
                  <span className={css.lightGrayColor}>{formatTimeToEng(outcome.last_edited_at as number, "time")}</span>
                </div>
              </>
            }
            placement="right"
          >
            <div className={css.lockWrap}>
              <div className={css.trapezoidCon}></div>
              <div className={css.lockCon}>
                <LockOutlinedIcon className={css.lockIcon} />
              </div>
            </div>
          </LightTooltip>
        )}
        <Checkbox
          icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
          checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
          size="small"
          className={css.checkbox}
          color="secondary"
          value={outcome.outcome_id}
          checked={hashValue[outcome.outcome_id as string] || false}
          onClick={stopPropagation()}
          onChange={handleChangeCheckbox}
          disabled={isLocked}
        ></Checkbox>
      </TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.outcome_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.shortcode}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.program?.map((item) => item.program_name).join(",")}</TableCell>
      {/* <TableCell className={clsx(css.tableCell)}>{outcome.subject?.map((item) => item.subject_name).join(",")}</TableCell> */}
      {/* <TableCell className={clsx(css.tableCell)}></TableCell> */}
      {/* <TableCell className={clsx(css.tableCell)}></TableCell> */}
      <TableCell className={clsx(css.tableCell)}>{outcome.assumed ? d("Yes").t("assess_label_yes") : ""}</TableCell>
      <TableCell className={css.tableCell}>{`${score_threshold}%`}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{outcome.author_name}</TableCell>
      <TableCell className={clsx(css.tableCell)}>{formattedTime(outcome.update_at)}</TableCell>
      <TableCell className={clsx(css.tableCell)}>
        <ul>
          {outcome.sets?.map((item, index) => (
            <li className={css.liCon} key={`${index}${item.set_name}`}>
              {item.set_name}
            </li>
          ))}
        </ul>
        {/* <div className={css.outcomeSet}>{outcome.sets?.map((item) => item.set_name).join(";")}</div> */}
      </TableCell>
      <TableCell className={clsx(css.tableCell, isLocked ? css.disableBtn : "")}>
        {outcome.publish_status === OutcomePublishStatus.published && (
          <Permission value={PermissionType.delete_published_learning_outcome_448}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {userId !== outcome.author_id && outcome.publish_status === OutcomePublishStatus.pending && (
          <Permission value={PermissionType.delete_org_pending_learning_outcome_447}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {userId === outcome.author_id && outcome.publish_status === OutcomePublishStatus.pending && (
          <Permission value={PermissionType.delete_my_pending_learning_outcome_446}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
            >
              <DeleteOutlineIcon />
            </LButton>
          </Permission>
        )}
        {outcome.publish_status === OutcomePublishStatus.pending && !isUnpublish(queryCondition) && (
          <Permission value={PermissionType.approve_pending_learning_outcome_481}>
            <LButton
              as={IconButton}
              replace
              className={css.approveIconColor}
              onClick={stopPropagation((e) => onApprove(outcome.outcome_id as string))}
            >
              <DoneIcon />
            </LButton>
          </Permission>
        )}
        {outcome.publish_status === OutcomePublishStatus.pending && !isUnpublish(queryCondition) && (
          <Permission value={PermissionType.reject_pending_learning_outcome_482}>
            <LButton
              as={IconButton}
              replace
              className={css.iconColor}
              onClick={stopPropagation((e) => onReject(outcome.outcome_id as string))}
            >
              <ClearIcon />
            </LButton>
          </Permission>
        )}
        {userId !== outcome.author_id &&
          (outcome.publish_status === OutcomePublishStatus.draft || outcome.publish_status === OutcomePublishStatus.rejected) && (
            <Permission value={PermissionType.delete_org_unpublished_learning_outcome_445}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
          )}
        {userId === outcome.author_id &&
          (outcome.publish_status === OutcomePublishStatus.draft || outcome.publish_status === OutcomePublishStatus.rejected) && (
            <Permission value={PermissionType.delete_my_unpublished_learning_outcome_444}>
              <LButton
                as={IconButton}
                replace
                className={css.iconColor}
                onClick={stopPropagation((e) => onDelete(outcome.outcome_id as string))}
              >
                <DeleteOutlineIcon />
              </LButton>
            </Permission>
          )}
      </TableCell>
    </TableRow>
  );
}

interface OutcomeActionProps {
  onPublish: (id: NonNullable<GetOutcomeDetail["outcome_id"]>) => any;
  onDelete: (id: NonNullable<GetOutcomeDetail["outcome_id"]>) => any;
  onApprove: (id: NonNullable<GetOutcomeDetail["outcome_id"]>) => any;
  onReject: (id: NonNullable<GetOutcomeDetail["outcome_id"]>) => any;
}

export interface OutcomeTableProps extends OutcomeActionProps {
  formMethods: UseFormMethods<BulkListForm>;
  total: number;
  userId: string;
  amountPerPage?: number;
  list: GetOutcomeDetail[];
  queryCondition: OutcomeQueryCondition;
  onChangePage: (page: number) => void;
  onClickOutcome: (id: GetOutcomeDetail["outcome_id"]) => any;
}
export function OutcomeTable(props: OutcomeTableProps) {
  const css = useStyles();
  const { formMethods, list, total, userId, queryCondition, onPublish, onDelete, onChangePage, onClickOutcome, onApprove, onReject } =
    props;
  const amountPerPage = props.amountPerPage ?? 20;
  // const allValue = useMemo(() => list.map((outcome) => outcome.outcome_id as string), [list]);
  const allValue = useMemo(
    () => list.filter((outcome) => !outcome.locked_by || outcome.locked_by === "-").map((item) => item.outcome_id!),
    [list]
  );
  const { control } = formMethods;
  const handleChangePage = (event: object, page: number) => onChangePage(page);
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517} overflowX="auto">
      <Controller
        name={BulkListFormKey.CHECKED_BULK_IDS}
        control={control}
        defaultValue={[]}
        render={({ ref, ...props }) => (
          <CheckboxGroup
            allValue={allValue}
            {...props}
            render={(selectedContentGroupContext) => (
              <TableContainer>
                <Table ref={ref}>
                  <TableHead className={css.tableHead}>
                    <TableRow>
                      <TableCell align="center" padding="checkbox">
                        <Checkbox
                          icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
                          checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
                          size="small"
                          className={css.checkbox}
                          color="secondary"
                          checked={selectedContentGroupContext.isAllvalue}
                          onChange={selectedContentGroupContext.registerAllChange}
                        />
                      </TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Short Code").t("assess_label_short_code")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Program").t("assess_label_program")}</TableCell>
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Subject").t("assess_label_subject")}</TableCell> */}
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Milestones").t("assess_label_milestone")}</TableCell> */}
                      {/* <TableCell className={clsx(css.tableCell)}>{d("Standard").t("assess_label_Standard")}</TableCell> */}
                      <TableCell className={clsx(css.tableCell)}>{d("Assumed").t("assess_label_assumed")}</TableCell>
                      <TableCell className={css.tableCell}>{d("Score Threshold").t("learning_outcome_label_threshold")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Author").t("library_label_author")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Created On").t("library_label_created_on")}</TableCell>
                      <TableCell className={clsx(css.tableCell)}>
                        {d("Learning Outcome Set").t("assess_set_learning_outcome_set")}
                      </TableCell>
                      <TableCell className={clsx(css.tableCell)}>{d("Actions").t("assess_label_actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list.map((item, idx) => (
                      <OutomeRow
                        key={item.outcome_id}
                        userId={userId}
                        outcome={item}
                        {...{ onPublish, onDelete, queryCondition, selectedContentGroupContext, onClickOutcome, onApprove, onReject }}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
        )}
      />

      <Pagination
        page={queryCondition.page}
        className={css.pagination}
        classes={{ ul: css.paginationUl }}
        onChange={handleChangePage}
        count={Math.ceil(total / amountPerPage)}
        color="primary"
      />
    </LayoutBox>
  );
}
