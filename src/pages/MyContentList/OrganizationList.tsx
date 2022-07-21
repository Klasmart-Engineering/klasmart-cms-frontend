import { ConnectionDirection, OrganizationSortBy, OrganizationSortInput, SortOrder } from "@api/api-ko-schema.auto";
import { GetOrganizationsQueryVariables } from "@api/api-ko.auto";
import CursorPagination from "@components/CursorPagination/CursorPagination";
import { FormattedTextField, frontTrim } from "@components/FormattedTextField";
import { resultsTip } from "@components/TipImages";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextFieldProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import { InfoOutlined, Search } from "@mui/icons-material";
import { getOrgList } from "@reducers/content";
import { RootState } from "@reducers/index";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { cloneDeep, uniq } from "lodash";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { EntityFolderContentData } from "../../api/api.auto";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
import { getDefaultValue, getPageDesc, OrgsTable } from "./OrgsTable";

export interface OrgInfoProps {
  organization_id: string;
  organization_name?: string;
  email?: string;
}

const LightTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
  },
}))(Tooltip);

const useStyles = makeStyles(() =>
  createStyles({
    okBtn: {
      marginLeft: "40px !important",
    },
    dialogTitle: {
      padding: "10px 24px",
      "& .MuiTypography-h6": {
        fontWeight: 700,
      },
    },
    dialogContent: {
      padding: "0px 40px",
      borderBottom: "none",
    },
    tooltipIcon: {
      color: "#666",
      verticalAlign: "middle",
      marginLeft: "5px",
    },
    searchButon: {
      marginLeft: 10,
      minWidth: 95,
    },
    searchBar: {
      display: "flex",
      width: "60%",
      "& .MuiOutlinedInput-inputMarginDense": {
        padding: "4.5px 10.5px",
      },
    },
    content: {
      paddingTop: 10,
      height: 490,
    },
    radio: {
      padding: "11px 0px",
      margin: 0,
    },
  })
);
const SELECTED_ORG = "SELECTED_ORG";
export enum ShareScope {
  share_all = "{share_all}",
  share_to_org = "share_to_org",
}
export enum CursorType {
  start = "start",
  prev = "prev",
  next = "next",
  end = "end",
}
export type CursorListProps = Pick<GetOrganizationsQueryVariables, "direction" | "cursor" | "count"> & {
  curentPageCursor?: CursorType;
  sort?: OrganizationSortInput;
  search?: string;
};

export interface OrganizationListProps {
  open: boolean;
  orgList: OrgInfoProps[];
  onClose: () => any;
  onShareFolder: (ids: string[]) => ReturnType<LButtonProps["onClick"]>;
  selectedOrg: string[];
  folderName?: string;
}
export interface OrgsSortType {
  sortType: OrganizationSortBy;
  emailOrder: boolean;
  nameOrder: boolean;
}
export function OrganizationList(props: OrganizationListProps) {
  const css = useStyles();
  const { open, orgList, selectedOrg, onClose, onShareFolder, folderName } = props;
  const { orgListPageInfo, orgListTotal } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { control, watch, getValues, reset } = useForm();
  const dispatch = useDispatch();
  const allValue = useMemo(() => orgList?.map((org) => org.organization_id), [orgList]);
  const [radioValue, setRadioValue] = useState<string>(
    selectedOrg[0] === ShareScope.share_all ? ShareScope.share_all : ShareScope.share_to_org
  );
  const [newSelectedOrgIds, setNewSelectedOrgIds] = useState(true);
  const [beValues, setBeValues] = useState(selectedOrg[0] === ShareScope.share_all ? [] : selectedOrg);
  const [pageSize] = useState(10);
  const [pageDesc, setPageDesc] = useState(`1-${orgListTotal > pageSize ? pageSize : orgListTotal}`);
  const [orgsSort, setOrgsSort] = useState<OrgsSortType>({ sortType: OrganizationSortBy.Name, emailOrder: true, nameOrder: true });
  const [buttonSearch, setButtonSearch] = useState("");
  const inputSearch = watch()["inputSearch"] || "";
  useMemo(() => {
    const radioNewValue =
      selectedOrg && selectedOrg.length > 0
        ? selectedOrg[0] === ShareScope.share_all
          ? ShareScope.share_all
          : ShareScope.share_to_org
        : "";
    setRadioValue(radioNewValue);
  }, [selectedOrg]);

  let selectedOrgIds = useMemo(() => {
    const ids = radioValue ? (radioValue === ShareScope.share_all ? [ShareScope.share_all] : beValues || selectedOrg) : [];
    return ids;
  }, [radioValue, selectedOrg, beValues]);
  const handleChange = (value: string) => {
    setRadioValue(value);
    setNewSelectedOrgIds(false);
  };

  const searchOrgList = async ({ direction, cursor = "", curentPageCursor = CursorType.start, sort, search, count }: CursorListProps) => {
    const { sortType, emailOrder, nameOrder } = orgsSort;
    const searchValue = search ?? buttonSearch;
    search !== undefined && setButtonSearch(inputSearch);
    const initSort: OrganizationSortInput = {
      field: [sortType],
      order:
        (sortType === OrganizationSortBy.Name && nameOrder) || (sortType === OrganizationSortBy.OwnerEmail && emailOrder)
          ? SortOrder.Asc
          : SortOrder.Desc,
    };

    const { payload } = (await dispatch(
      getOrgList({ metaLoading: true, cursor, direction, sort: sort || initSort, searchValue, count: count || pageSize })
    )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getOrgList>>;
    if (!payload) return;
    setPageDesc(getPageDesc(curentPageCursor, count || pageSize, payload.orgListTotal, pageDesc));
    reset({
      ...getValues(),
      SELECTED_ORG: getDefaultValue(payload.orgs as OrgInfoProps[], beValues),
      inputSearch: searchValue,
    });
  };

  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") searchOrgList({ direction: ConnectionDirection.Forward, search: inputSearch });
  };

  const handleSortOrgList = (type: OrganizationSortBy) => {
    const { emailOrder, nameOrder } = orgsSort;
    const sort: OrganizationSortInput = {
      field: [type],
      order: type === OrganizationSortBy.Name ? (nameOrder ? SortOrder.Desc : SortOrder.Asc) : emailOrder ? SortOrder.Desc : SortOrder.Asc,
    };
    searchOrgList({ direction: ConnectionDirection.Forward, search: inputSearch, sort });
    type === OrganizationSortBy.Name
      ? setOrgsSort({ ...orgsSort, sortType: type, nameOrder: !nameOrder })
      : setOrgsSort({ ...orgsSort, sortType: type, emailOrder: !emailOrder });
  };

  const handleChangeBeValues = (id: string, checked: boolean) => {
    if (checked) {
      if (id && beValues) {
        setBeValues?.(uniq(beValues.concat([id])));
      }
    } else {
      if (id && beValues) {
        let newValue = cloneDeep(beValues);
        newValue = newValue.filter((v) => v !== id);
        setBeValues?.(uniq(newValue));
      }
    }
  };
  const handleChangeAllBeValues = (checked: boolean) => {
    if (checked) {
      if (beValues) {
        setBeValues?.(uniq(beValues.concat(allValue)));
      }
    } else {
      if (beValues) {
        let newValue = cloneDeep(beValues);
        allValue.forEach((id) => {
          newValue = newValue.filter((v) => v !== id);
        });
        setBeValues?.(uniq(newValue));
      }
    }
  };
  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle className={css.dialogTitle}>
        <Typography component="div" variant="h6" noWrap>
          {d("Distribute").t("library_label_distribute")}: {folderName ?? ""}
        </Typography>
      </DialogTitle>
      <DialogContent className={css.dialogContent} dividers>
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          <RadioGroup value={radioValue} onChange={(e) => handleChange(e.target.value)}>
            <FormControlLabel
              className={css.radio}
              style={{ borderBottom: "1px solid rgba(0, 0, 0, .12)" }}
              value={ShareScope.share_all}
              control={<Radio />}
              label={
                <>
                  <span>{d("Preset").t("library_label_preset")}</span>{" "}
                  <LightTooltip
                    placement="right"
                    title={d("Choosing this option will make the selected content available to current and future organizations.").t(
                      "library_msg_preset"
                    )}
                  >
                    <InfoOutlined className={css.tooltipIcon} />
                  </LightTooltip>
                </>
              }
            />
            <FormControlLabel
              className={css.radio}
              value={ShareScope.share_to_org}
              control={<Radio />}
              label={
                <>
                  <span>{d("Select Organizations").t("library_label_select_organizations")}</span>{" "}
                </>
              }
            />
          </RadioGroup>
          <div className={css.searchBar}>
            <Controller
              as={FormattedTextField}
              control={control}
              name="inputSearch"
              size="small"
              encode={frontTrim}
              decode={frontTrim}
              defaultValue={""}
              fullWidth
              onKeyPress={handleKeyPress}
              placeholder={d("Search").t("library_label_search")}
              disabled={radioValue !== ShareScope.share_to_org}
            />
            <Button
              className={css.searchButon}
              variant="contained"
              color="primary"
              disabled={radioValue !== ShareScope.share_to_org}
              onClick={() => searchOrgList({ direction: ConnectionDirection.Forward, search: inputSearch })}
            >
              <Search fontSize="small" /> {d("Search").t("library_label_search")}{" "}
            </Button>
          </div>
          {
            <div style={{ flex: 1 }}>
              <Controller
                name={SELECTED_ORG}
                control={control}
                defaultValue={newSelectedOrgIds ? getDefaultValue(orgList, beValues) : []}
                rules={{ required: true }}
                render={({ ref, ...props }) => (
                  <CheckboxGroup
                    allValue={allValue}
                    {...props}
                    render={(selectedContentGroupContext) => (
                      <div {...{ ref }} className={css.content}>
                        {orgList?.length > 0 ? (
                          <>
                            <OrgsTable
                              {...orgsSort}
                              disabled={radioValue !== ShareScope.share_to_org}
                              onSortOrgList={handleSortOrgList}
                              handleChangeBeValues={handleChangeBeValues}
                              list={orgList}
                              selectedContentGroupContext={selectedContentGroupContext}
                              render={
                                <Checkbox
                                  disabled={radioValue !== ShareScope.share_to_org}
                                  color="primary"
                                  checked={selectedContentGroupContext.isAllvalue}
                                  onChange={(e, checked) => {
                                    selectedContentGroupContext.registerAllChange(e);
                                    handleChangeAllBeValues(checked);
                                  }}
                                  style={{ height: 20, padding: 5 }}
                                />
                              }
                            />
                            <CursorPagination
                              pageDesc={pageDesc}
                              total={orgListTotal}
                              pageInfo={orgListPageInfo}
                              onChange={searchOrgList}
                              disabled={radioValue !== ShareScope.share_to_org}
                            />
                          </>
                        ) : (
                          resultsTip
                        )}
                      </div>
                    )}
                  />
                )}
              />
            </div>
          }
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "0px 40px 15px 0px" }}>
        <Button onClick={onClose} disableRipple={true} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <LButton color="primary" variant="contained" className={css.okBtn} onClick={() => onShareFolder(selectedOrgIds)}>
          {d("OK").t("general_button_OK")}
        </LButton>
      </DialogActions>
    </Dialog>
  );
}

export function useOrganizationList() {
  const [active, setActive] = useState(false);
  const [organizationListShowIndex, setOrganizationListShowInex] = useState(100);
  const [shareFolder, setShareFolder] = useState<EntityFolderContentData>();
  return useMemo(
    () => ({
      organizationListShowIndex,
      organizationListActive: active,
      openOrganizationList: () => {
        setOrganizationListShowInex(organizationListShowIndex + 1);
        setActive(true);
      },
      closeOrganizationList: () => {
        setActive(false);
      },
      shareFolder,
      setShareFolder,
    }),
    [active, setActive, shareFolder, setShareFolder, organizationListShowIndex]
  );
}
