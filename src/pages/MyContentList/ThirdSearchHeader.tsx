import { Checkbox, FormControlLabel, Grid, Menu, MenuItem, TextField } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { CheckBox, CheckBoxOutlineBlank, MoreHoriz } from "@material-ui/icons";
import FilterListIcon from "@material-ui/icons/FilterList";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import clsx from "clsx";
import produce from "immer";
import React, { ChangeEvent, useMemo } from "react";
import { UseFormMethods } from "react-hook-form";
import { EntityFolderContentData } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import { Author, OrderBy, PublishStatus, SearchContentsRequestContentType } from "../../api/type";
import { ExportCSVBtn, ExportCSVBtnProps } from "../../components/ExportCSVBtn";
import { PermissionResult } from "../../components/Permission";
import { usePermission } from "../../hooks/usePermission";
import { d, t } from "../../locale/LocaleManager";
import { content2ids } from "../../models/ModelEntityFolderContent";
import { Action } from "../../reducers/content";
import { isUnpublish } from "./FirstSearchHeader";
import { filterOptions, menuItemList } from "./SecondSearchHeader";
import { ContentListForm, ContentListFormKey, QueryCondition, QueryConditionBaseProps } from "./types";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20 + 10,
  },
  createBtn: {
    width: "125px",
    borderRadius: "23px",
    height: "48px",
    backgroundColor: "#0E78D5",
    textTransform: "capitalize",
  },
  nav: {
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "3px",
    textTransform: "capitalize",
  },
  searchBtn: {
    width: "111px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  bulkActionSelect: {
    width: 160,
    height: 40,
  },
  formControl: {
    minWidth: 136,
    marginLeft: "20px",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  switch: {
    display: "none",
    marginRight: "22px",
  },
  navigation: {
    padding: "20px 0px 10px 0px",
  },
  searchText: {
    width: "34%",
  },
  actives: {
    color: "#0E78D5",
  },
  tabMb: {
    textAlign: "right",
    position: "relative",
  },
  switchBtn: {
    width: "60px",
    height: "40px",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  tabs: {
    minHeight: "42px",
    height: "42px",
  },
  addFloderBtn: {
    width: 160,
    height: 40,
    marginLeft: 30,
    boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
  },
  selectAll: {
    color: "#666",
    marginRight: 30,
    fontSize: 14,
  },
  tabCon: {
    "&.MuiTab-root": {
      minWidth: 60,
    },
  },
  selectBox: {
    display: "inline-block",
    padding: "12px",
    boxSizing: "border-box",
  },
  bulkActionCon: {
    "& .MuiInputLabel-outlined.MuiInputLabel-marginDense": {
      width: "calc(100% - 46px)",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      width: "100%",
    },
  },
  badacontentSelectWidth: {
    width: "100%",
  },
  publishedSelectWidth: {
    width: "30%",
  },
  alignRight: {
    textAlign: "right",
  },
  unpublishedSelectWidth: {
    width: "calc(50% - 162px)",
  },
  ortherSelectWidth: {
    width: "50%",
  },
}));

function SubUnpublished(props: QueryConditionBaseProps) {
  const classes = useStyles();
  const { value, onChange } = props;

  const handleChange = (e: ChangeEvent<{}>, publish_status: QueryCondition["publish_status"]) => {
    if (publish_status === PublishStatus.pending) {
      return onChange({ ...value, publish_status, author: Author.self });
    }
    onChange({ ...value, publish_status, author: "" });
  };

  return (
    <Tabs
      className={classes.tabs}
      value={value.publish_status}
      onChange={handleChange}
      indicatorColor="primary"
      textColor="primary"
      centered
    >
      <Tab className={classes.tabCon} value={PublishStatus.draft} label={d("Draft").t("library_label_draft")} />
      <Tab
        className={classes.tabCon}
        value={PublishStatus.pending}
        label={d("Waiting for Approval").t("library_label_waiting_for_approval")}
      />
      <Tab className={classes.tabCon} value={PublishStatus.rejected} label={d("Rejected").t("library_label_rejected")} />
    </Tabs>
  );
}

export enum BulkAction {
  publish = "publish",
  remove = "remove",
  delete = "delete",
  move = "move",
  deleteFolder = "deleteFolder",
  approve = "approve",
  reject = "reject",
  exportCsv = "exportCsv",
}
interface BulkActionOption {
  label: string;
  value: BulkAction;
}

function getBulkAction(
  condition: QueryCondition,
  perm: PermissionResult<PermissionType[]>,
  actionObj: ThirdSearchHeaderProps["actionObj"]
): BulkActionOption[] {
  const unpublish = isUnpublish(condition);

  if (condition.content_type === SearchContentsRequestContentType.assetsandfolder) {
    let res = [
      {
        label: d("Move to").t("library_label_move"),
        value: BulkAction.move,
      },
      {
        label: d("Delete Folder").t("library_label_delete_folder"),
        value: BulkAction.deleteFolder,
      },
      {
        label: d("Delete").t("library_label_delete"),
        value: BulkAction.delete,
      },
    ];

    if (perm.delete_asset_340 && actionObj?.notFolder) {
      res = [
        {
          label: d("Move to").t("library_label_move"),
          value: BulkAction.move,
        },
        {
          label: d("Delete").t("library_label_delete"),
          value: BulkAction.delete,
        },
      ];
    }

    if (actionObj?.folder) {
      res = [
        {
          label: d("Move to").t("library_label_move"),
          value: BulkAction.move,
        },
        {
          label: d("Delete Folder").t("library_label_delete_folder"),
          value: BulkAction.deleteFolder,
        },
      ];
    }

    if (actionObj?.bothHave)
      res = [
        {
          label: d("Move to").t("library_label_move"),
          value: BulkAction.move,
        },
      ];
    return res;
  }

  switch (condition.publish_status) {
    case PublishStatus.published:
      let res: BulkActionOption[] = [];

      if (perm.create_folder_289 && perm.archive_published_content_273) {
        res = [
          {
            label: d("Remove").t("library_label_remove"),
            value: BulkAction.remove,
          },
          {
            label: d("Move to").t("library_label_move"),
            value: BulkAction.move,
          },
          {
            label: d("Delete Folder").t("library_label_delete_folder"),
            value: BulkAction.deleteFolder,
          },
          {
            label: d("Export as CSV").t("library_label_export_as_csv"),
            value: BulkAction.exportCsv,
          },
        ];
      } else if (perm.create_folder_289 && !perm.archive_published_content_273) {
        res = [
          {
            label: d("Move to").t("library_label_move"),
            value: BulkAction.move,
          },
          {
            label: d("Delete Folder").t("library_label_delete_folder"),
            value: BulkAction.deleteFolder,
          },
          {
            label: d("Export as CSV").t("library_label_export_as_csv"),
            value: BulkAction.exportCsv,
          },
        ];
      } else if (!perm.create_folder_289 && perm.archive_published_content_273) {
        res = [
          {
            label: d("Remove").t("library_label_remove"),
            value: BulkAction.remove,
          },
          {
            label: d("Export as CSV").t("library_label_export_as_csv"),
            value: BulkAction.exportCsv,
          },
        ];
      } else {
        res = [
          {
            label: d("Export as CSV").t("library_label_export_as_csv"),
            value: BulkAction.exportCsv,
          },
        ];
      }

      if (actionObj?.folder) {
        if (perm.create_folder_289) {
          res = [
            {
              label: d("Move to").t("library_label_move"),
              value: BulkAction.move,
            },
            {
              label: d("Delete Folder").t("library_label_delete_folder"),
              value: BulkAction.deleteFolder,
            },
          ];
        } else {
          res = [];
        }
      }

      if (actionObj?.notFolder) {
        if (perm.archive_published_content_273 && perm.create_folder_289) {
          res = [
            {
              label: d("Remove").t("library_label_remove"),
              value: BulkAction.remove,
            },
            {
              label: d("Move to").t("library_label_move"),
              value: BulkAction.move,
            },
            {
              label: d("Export as CSV").t("library_label_export_as_csv"),
              value: BulkAction.exportCsv,
            },
          ];
        } else if (!perm.archive_published_content_273 && perm.create_folder_289) {
          res = [
            {
              label: d("Move to").t("library_label_move"),
              value: BulkAction.move,
            },
            {
              label: d("Export as CSV").t("library_label_export_as_csv"),
              value: BulkAction.exportCsv,
            },
          ];
        } else if (!perm.create_folder_289 && perm.archive_published_content_273) {
          res = [
            {
              label: d("Remove").t("library_label_remove"),
              value: BulkAction.remove,
            },
            {
              label: d("Export as CSV").t("library_label_export_as_csv"),
              value: BulkAction.exportCsv,
            },
          ];
        } else {
          res = [
            {
              label: d("Export as CSV").t("library_label_export_as_csv"),
              value: BulkAction.exportCsv,
            },
          ];
        }
      }

      if (actionObj?.bothHave) {
        if (perm.create_folder_289) {
          res = [
            {
              label: d("Move to").t("library_label_move"),
              value: BulkAction.move,
            },
          ];
        } else {
          res = [];
        }
      }

      return res;

    case PublishStatus.pending:
      const pendingRes = [];

      if (unpublish) {
        pendingRes.push({
          label: d("Delete").t("library_label_delete"),
          value: BulkAction.delete,
        });
      } else {
        if (perm.approve_pending_content_271) {
          pendingRes.push({
            label: d("Approve").t("library_label_approve"),
            value: BulkAction.approve,
          });
        }

        if (perm.reject_pending_content_272) {
          pendingRes.push({
            label: d("Reject").t("library_label_reject"),
            value: BulkAction.reject,
          });
        }
      }

      return pendingRes;

    case PublishStatus.archive:
      const result = [];
      if (perm.republish_archived_content_274)
        result.push({
          label: d("Republish").t("library_label_republish"),
          value: BulkAction.publish,
        });
      if (perm.delete_archived_content_275)
        result.push({
          label: d("Delete").t("library_label_delete"),
          value: BulkAction.remove,
        });
      return result;

    case PublishStatus.draft:
    case PublishStatus.rejected:
      return [
        {
          label: d("Delete").t("library_label_delete"),
          value: BulkAction.delete,
        },
      ];

    default:
      return [];
  }
}

const sortOptions = () => [
  {
    label: d("Content Name (A-Z)").t("library_label_content_name_atoz"),
    value: OrderBy.content_name,
  },
  {
    label: d("Content Name (Z-A)").t("library_label_content_name_ztoa"),
    value: OrderBy._content_name,
  },
  {
    label: d("Created On (New-Old)").t("library_label_created_on_newtoold"),
    value: OrderBy._updated_at,
  },
  {
    label: d("Created On (Old-New)").t("library_label_created_on_oldtonew"),
    value: OrderBy.updated_at,
  },
];

export interface ThirdSearchHeaderProps extends QueryConditionBaseProps {
  onBulkPublish: () => any;
  onBulkDelete: (type: Action) => any;
  onBulkMove: () => any;
  actionObj:
    | {
        folder: boolean;
        notFolder: boolean;
        bothHave: boolean;
      }
    | undefined;
  onBulkDeleteFolder: () => any;
  onBulkApprove: () => any;
  onBulkReject: () => any;
  onExportCSV: ExportCSVBtnProps["onClick"];
  ids?: string[];
  contentList: EntityFolderContentData[];
  conditionFormMethods: UseFormMethods<ContentListForm>;
}
export function ThirdSearchHeader(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const {
    value,
    onChange,
    onBulkDelete,
    onBulkPublish,
    onBulkMove,
    actionObj,
    onBulkDeleteFolder,
    onBulkApprove,
    onBulkReject,
    onExportCSV,
    contentList,
    ids = [],
    conditionFormMethods,
  } = props;
  const collectedIds = useMemo(() => content2ids(contentList, ids), [contentList, ids]);
  const perm = usePermission([
    PermissionType.delete_asset_340,
    PermissionType.archive_published_content_273,
    PermissionType.republish_archived_content_274,
    PermissionType.delete_archived_content_275,
    PermissionType.approve_pending_content_271,
    PermissionType.reject_pending_content_272,
    PermissionType.create_folder_289,
  ]);
  const unpublish = isUnpublish(value);

  const handleChangeBulkAction = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === BulkAction.publish) onBulkPublish();
    if (event.target.value === BulkAction.delete) onBulkDelete(Action.delete);
    if (event.target.value === BulkAction.remove) onBulkDelete(Action.remove);
    if (event.target.value === BulkAction.move) onBulkMove();
    if (event.target.value === BulkAction.deleteFolder) onBulkDeleteFolder();
    if (event.target.value === BulkAction.approve) onBulkApprove();
    if (event.target.value === BulkAction.reject) onBulkReject();
  };

  const { setValue } = conditionFormMethods;

  const handleChangeOrder = (event: ChangeEvent<HTMLInputElement>) => {
    const order_by = event.target.value as OrderBy | undefined;
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };
  const handleChangeFilterOption = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = produce(value, (draft) => {
      const content_type = event.target.value;
      draft.content_type = content_type;
    });
    onChange({ ...newValue });
  };

  const bulkOptions = getBulkAction(value, perm, actionObj).map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.value !== BulkAction.exportCsv ? (
        item.label
      ) : (
        <ExportCSVBtn name={"Export result"} title={"Content Id"} data={collectedIds} label={item.label} onClick={onExportCSV} />
      )}
    </MenuItem>
  ));
  const orderbyOptions = sortOptions().map((item) => (
    <MenuItem key={item.label} value={item.value}>
      {item.label}
    </MenuItem>
  ));
  return (
    <div className={classes.root}>
      <Hidden only={["xs", "sm"]}>
        <Grid
          container
          spacing={3}
          style={{
            marginTop: "6px",
          }}
        >
          {!value.program_group && (
            <div
              className={classes.selectBox}
              style={{ width: value.publish_status === PublishStatus.published ? "70%" : unpublish ? "calc(50% - 162px)" : "50%" }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
                    checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
                    size="small"
                    color="primary"
                    checked={ids.length > 0 && ids.length === contentList.length}
                    onChange={(e) => {
                      setValue(ContentListFormKey.CHECKED_CONTENT_IDS, e.target.checked ? contentList.map((item) => item.id) : []);
                    }}
                  />
                }
                label={d("Select All").t("schedule_detail_select_all")}
              />
              <span className={classes.selectAll}>{t("library_label_files_selected", { value: ids.length.toString() })}</span>
              {bulkOptions.length > 0 && (
                <TextField
                  className={classes.bulkActionCon}
                  style={{
                    width: 160,
                    marginRight: 20,
                  }}
                  size="small"
                  onChange={handleChangeBulkAction}
                  label={d("Bulk Actions").t("library_label_bulk_actions")}
                  value=""
                  select
                  SelectProps={{
                    MenuProps: {
                      transformOrigin: {
                        vertical: -40,
                        horizontal: "left",
                      },
                    },
                  }}
                >
                  {bulkOptions}
                </TextField>
              )}
              {value.publish_status === PublishStatus.published && (
                <TextField
                  style={{
                    width: 160,
                  }}
                  size="small"
                  onChange={handleChangeFilterOption}
                  label={d("Content Type").t("library_label_contentType")}
                  value={value.content_type}
                  select
                  SelectProps={{
                    MenuProps: {
                      transformOrigin: {
                        vertical: -40,
                        horizontal: "left",
                      },
                    },
                  }}
                >
                  {menuItemList(filterOptions(value))}
                </TextField>
              )}
            </div>
          )}
          {unpublish && (
            <div style={{ width: "324px", padding: "12px", boxSizing: "border-box" }}>
              <SubUnpublished value={value} onChange={onChange} />
            </div>
          )}

          <div
            className={clsx(classes.selectBox, classes.alignRight, {
              [classes.badacontentSelectWidth]: value.program_group,
              [classes.publishedSelectWidth]: !value.program_group && value.publish_status === PublishStatus.published,
              [classes.unpublishedSelectWidth]: !value.program_group && value.publish_status !== PublishStatus.published && unpublish,
              [classes.ortherSelectWidth]: !value.program_group && value.publish_status !== PublishStatus.published && !unpublish,
            })}
          >
            <TextField
              size="small"
              style={{
                width: 160,
              }}
              onChange={handleChangeOrder}
              label={d("Sort By").t("library_label_sort_by")}
              value={value.order_by}
              select
              SelectProps={{
                MenuProps: {
                  transformOrigin: {
                    vertical: -40,
                    horizontal: "left",
                  },
                },
              }}
            >
              {orderbyOptions}
            </TextField>
          </div>
        </Grid>
      </Hidden>
    </div>
  );
}
export function ThirdSearchHeaderMb(props: ThirdSearchHeaderProps) {
  const classes = useStyles();
  const {
    value,
    onChange,
    onBulkDelete,
    onBulkPublish,
    onBulkMove,
    actionObj,
    onBulkDeleteFolder,
    onBulkApprove,
    onBulkReject,
    onExportCSV,
    contentList,
    ids = [],
    conditionFormMethods,
  } = props;
  const collectedIds = useMemo(() => content2ids(contentList, ids), [contentList, ids]);
  const perm = usePermission([
    PermissionType.delete_asset_340,
    PermissionType.archive_published_content_273,
    PermissionType.republish_archived_content_274,
    PermissionType.delete_archived_content_275,
    PermissionType.approve_pending_content_271,
    PermissionType.reject_pending_content_272,
    PermissionType.create_folder_289,
  ]);
  const unpublish = isUnpublish(value);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElLeft, setAnchorElLeft] = React.useState<null | HTMLElement>(null);
  const [anchorFilter, setAnchorFilter] = React.useState<null | HTMLElement>(null);
  const { setValue } = conditionFormMethods;

  const handleClickBulkActionButton = (event: any) => {
    setAnchorElLeft(event.currentTarget);
  };

  const handleClickActionItem = (event: any, bulkaction: BulkAction) => {
    setAnchorElLeft(null);
    if (bulkaction === BulkAction.publish) onBulkPublish();
    if (bulkaction === BulkAction.delete) onBulkDelete(Action.delete);
    if (bulkaction === BulkAction.remove) onBulkDelete(Action.remove);
    if (bulkaction === BulkAction.move) onBulkMove();
    if (bulkaction === BulkAction.deleteFolder) onBulkDeleteFolder();
    if (bulkaction === BulkAction.approve) onBulkApprove();
    if (bulkaction === BulkAction.reject) onBulkReject();
  };

  const handleClose = () => {
    setAnchorElLeft(null);
  };

  const showSort = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickOrderbyItem = (event: any, order_by: OrderBy | undefined) => {
    setAnchorEl(null);
    onChange(
      produce(value, (draft) => {
        order_by ? (draft.order_by = order_by) : delete draft.order_by;
      })
    );
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const actions = getBulkAction(value, perm, actionObj);

  const handleClickFilterIcon = (event: any) => {
    setAnchorFilter(event?.currentTarget);
  };

  const handleClickFilterItem = (event: any, content_type: SearchContentsRequestContentType) => {
    setAnchorFilter(null);
    onChange(
      produce(value, (draft) => {
        draft.content_type = content_type;
      })
    );
  };

  const handleFilterClose = () => setAnchorFilter(null);

  return (
    <div className={classes.root}>
      <Hidden only={["md", "lg", "xl"]}>
        <Grid
          container
          alignItems="center"
          style={{
            marginTop: "6px",
            position: "relative",
          }}
        >
          <Grid item sm={9} xs={9}>
            {!value.program_group && (
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlank viewBox="3 3 18 18"></CheckBoxOutlineBlank>}
                    checkedIcon={<CheckBox viewBox="3 3 18 18"></CheckBox>}
                    size="small"
                    color="primary"
                    checked={ids.length > 0 && ids.length === contentList.length}
                    onChange={(e) => {
                      setValue(ContentListFormKey.CHECKED_CONTENT_IDS, e.target.checked ? contentList.map((item) => item.id) : []);
                    }}
                  />
                }
                label={d("Select All").t("schedule_detail_select_all")}
              />
            )}
            {!value.program_group && (
              <span className={classes.selectAll}>{t("library_label_files_selected", { value: ids.length.toString() })}</span>
            )}
          </Grid>
          <Grid container justify="flex-end" alignItems="center" item sm={3} xs={3}>
            {value.content_type !== SearchContentsRequestContentType.assetsandfolder && !value.program_group && (
              <FilterListIcon onClick={handleClickFilterIcon} />
            )}
            <Menu anchorEl={anchorFilter} keepMounted open={Boolean(anchorFilter)} onClose={handleFilterClose}>
              {filterOptions(value).map((item, index) => (
                <MenuItem
                  key={item.label}
                  selected={value.content_type === item.value}
                  onClick={(event) => handleClickFilterItem(event, item.value)}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
            {actions.length > 0 && <MoreHoriz onClick={handleClickBulkActionButton} />}
            <Menu anchorEl={anchorElLeft} keepMounted open={Boolean(anchorElLeft)} onClose={handleClose}>
              {actions.map((item, index) => (
                <MenuItem key={item.label} onClick={(event) => handleClickActionItem(event, item.value)}>
                  {item.value !== BulkAction.exportCsv ? (
                    item.label
                  ) : (
                    <ExportCSVBtn
                      name={"Export result"}
                      title={"Content Id"}
                      data={collectedIds}
                      label={item.label}
                      onClick={onExportCSV}
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>
            <ImportExportIcon onClick={showSort} />
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleSortClose}>
              {sortOptions().map((item, index) => (
                <MenuItem key={item.label} selected={value.order_by === item.value} onClick={(e) => handleClickOrderbyItem(e, item.value)}>
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
        {unpublish && <SubUnpublished value={value} onChange={onChange} />}
      </Hidden>
    </div>
  );
}
