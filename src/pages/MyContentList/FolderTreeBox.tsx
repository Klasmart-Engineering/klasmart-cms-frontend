import { EntityFolderItemInfo, EntityTreeResponse } from "@api/api.auto";
import folderIconUrl from "@assets/icons/foldericon.svg";
import TreeViewFolder from "@components/TreeViewFolder";
import { t } from "@locale/LocaleManager";
import { createStyles, Dialog, DialogContent, DialogTitle, Hidden, IconButton, makeStyles, Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp, ArrowRight, Close } from "@material-ui/icons";
import { getSelectLabel } from "@models/ModelContentDetailForm";
import clsx from "clsx";
import React, { useReducer } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    treeItemLabel: {
      width: "calc(100% - 35px)",
      height: 40,
      fontWeight: "lighter",
      lineHeight: 40,
      display: "flex",
      alignItems: "center",
      paddingLeft: 4,
      paddingRight: 4,
    },

    folderBox: {
      width: "28%",
      maxWidth: 340,
      height: 750,
      marginTop: 30,
      marginRight: 30,
      boxShadow: theme.shadows[1],
      flexDirection: "column",
      display: "flex",
      borderRadius: 5,
    },
    folderTree: {
      overflowY: "auto",
      overflowX: "hidden",
      paddingTop: "15px",
    },
    folderIcon: {
      marginRight: 10,
      color: "#FBCB2C",
    },
    title: {
      backgroundColor: "#f0f0f0",
      width: "100%",
      height: 36,
      lineHeight: "36px",
      textAlign: "center",
      borderRadius: "5px 5px 0 0",
    },
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    scroll: {
      padding: "8px 0",
      "&::-webkit-scrollbar": {
        width: "8px",
      },

      "&::-webkit-scrollbar-thumb": {
        borderRadius: "6px",
        background: "#c4c4c4",
      },
    },
    folderSelect: {
      border: " 1px solid #979797",
      borderRadius: 4,
      display: "flex",
      justifyContent: "space-between",
      height: 40,
      padding: "4px 12px",
    },
    image: {
      width: 25,
      marginRight: 10,
      alignItems: "center",
    },
    empty: {
      width: "100%",
      textAlign: "center",
      margin: "300px auto",
      color: "rgba(0, 0, 0, 0.6)",
    },
    dropDown: {
      width: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);
export const ROOT_ID = "/";

export interface FolderTreeBoxProps {
  folders: EntityTreeResponse;
  defaultPath: string;
  onClickFolderPath: (path: string) => any;
  parentFolderInfo?: EntityFolderItemInfo;
  searchName?: string;
}

export function FolderTreeBox(props: FolderTreeBoxProps) {
  const css = useStyles();
  const { folders, defaultPath, onClickFolderPath, parentFolderInfo, searchName } = props;
  const [open, toggle] = useReducer((open) => !open, false);
  const { item_count } = getSelectLabel({ defaultPath, folders });
  return (
    <>
      <Hidden only={["xs", "sm"]}>
        <div className={css.folderBox}>
          <div className={css.title}>{t("library_label_hierarchy_folder_tree")}</div>
          <div className={clsx(css.folderTree, css.scroll)}>
            <TreeViewFolder
              node={folders}
              handleLabelClick={(path: string) => {
                onClickFolderPath(path);
              }}
              defaultCollapseIcon={<ArrowDropDown />}
              defaultExpandIcon={<ArrowRight />}
              defaultIconPosition="left"
              defaultPath={defaultPath}
              paddingLeft={15}
            />
            <div>
              {folders.item_count === 0 && searchName && (
                <div className={css.empty}>
                  <p>{t("library_label_empty")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Hidden>
      <Hidden only={["md", "lg", "xl"]}>
        <div className={css.folderSelect} onClick={toggle}>
          {(!defaultPath || defaultPath === "/" ? true : parentFolderInfo?.name) && (
            <>
              <div className={css.treeItemLabel}>
                <img src={folderIconUrl} alt="" className={css.image} />
                <div style={{ width: "calc(100% - 35px)", display: "flex", alignItems: "center" }}>
                  <Typography component="div" noWrap>
                    {parentFolderInfo?.name || t("library_label_hierarchy_root_folder")}
                    {!!item_count && <span style={{ color: "#4B88F5" }}> ({item_count <= 9 ? item_count : "9+"})</span>}
                  </Typography>
                </div>
              </div>
              <div className={css.dropDown}>
                <ArrowDropDown />
              </div>
            </>
          )}
        </div>

        <Dialog open={open} fullWidth>
          <DialogTitle>
            <IconButton onClick={toggle} className={css.closeBtn}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={css.scroll}>
            <div className={css.folderTree}>
              <TreeViewFolder
                node={folders}
                handleLabelClick={(path: string) => {
                  toggle();
                  onClickFolderPath(path);
                }}
                defaultCollapseIcon={<ArrowDropUp />}
                defaultExpandIcon={<ArrowDropDown />}
                defaultIconPosition="right"
                defaultPath={defaultPath}
                paddingLeft={15}
              />
            </div>
          </DialogContent>
        </Dialog>
      </Hidden>
    </>
  );
}
