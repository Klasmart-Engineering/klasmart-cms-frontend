import { EntityFolderItemInfo, EntityTreeResponse } from "@api/api.auto";
import folderIconUrl from "@assets/icons/foldericon.svg";
import TreeViewFolder from "@components/TreeViewFolder";
import { createStyles, Dialog, DialogContent, DialogTitle, IconButton, makeStyles, Typography } from "@material-ui/core";
import { ArrowDropDown, ArrowDropUp, ArrowRight, Close } from "@material-ui/icons";
import React, { useReducer } from "react";

const useStyles = makeStyles((theme) =>
  createStyles({
    treeItemLabel: {
      height: 40,
      fontSize: 14,
      fontWeight: "lighter",
      lineHeight: 40 / 14,
      display: "flex",
      alignItems: "center",
      paddingLeft: 4,
      paddingRight: 4,
    },

    folderBox: {
      width: 300,
      height: 500,
      margin: "30px 30px 0 0 ",
      boxShadow: theme.shadows[1],
      flexDirection: "column",
      display: "flex",
      borderRadius: 5,
    },
    folderTree: {
      overflowY: "scroll",
      overflowX: "hidden",
      padding: "15px",

      "&::-webkit-scrollbar": {
        width: "8px",
      },

      "&::-webkit-scrollbar-thumb": {
        border: " 1px solid #000000",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "6px",
        background: "#c4c4c4",
      },
      "&::-webkit-scrollbar-thumb:window-inactive": {
        backgroundColor: "#c4c4c4",
      },
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
    dialogScroll: {
      padding: "8px 0",
      "&::-webkit-scrollbar": {
        width: "8px",
      },

      "&::-webkit-scrollbar-thumb": {
        borderRadius: "6px",
        background: "#c4c4c4",
      },
    },
    FolderSelect: {
      border: " 1px solid #979797",
      borderRadius: 4,
      display: "flex",
      justifyContent: "space-between",
      height: 40,
      padding: "4px 12px",
    },
  })
);
export const ROOT_ID = "/";

export interface FolderTreeBoxProps {
  folders: EntityTreeResponse;
  defaultPath: string;
  onClickFolderPath: (path: string) => any;
  sm: boolean;
  parentFolderInfo?: EntityFolderItemInfo;
}

export function FolderTreeBox(props: FolderTreeBoxProps) {
  const css = useStyles();
  const { sm, folders, defaultPath, onClickFolderPath, parentFolderInfo } = props;
  const [open, toggle] = useReducer((open) => !open, false);
  // const {name, item_count} =  getSelectLabel({folders,defaultPath});
  // console.log("defaultPath=",defaultPath,folders)
  // console.log("name=",name)
  return (
    <>
      {!sm && (
        <div className={css.folderBox}>
          <div className={css.title}>Folder Tree</div>
          <div className={css.folderTree}>
            <TreeViewFolder
              node={folders}
              handleLabelClick={(path: string) => {
                onClickFolderPath(path);
              }}
              defaultCollapseIcon={<ArrowDropDown />}
              defaultExpandIcon={<ArrowRight />}
              defaultIconPosition="left"
              defaultPath={defaultPath}
            />
          </div>
        </div>
      )}
      {sm && (
        <>
          <div className={css.FolderSelect} onClick={toggle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={folderIconUrl} alt="" style={{ width: 25, marginRight: 10, alignItems: "center" }} />
              <div style={{ width: "calc(100% - 35px)", display: "flex", alignItems: "center" }}>
                <Typography component="div" noWrap>
                  {parentFolderInfo?.name || "folderRoot"}
                  {/* {!!item_count && <span style={{color:"#4B88F5"}}> ({item_count <= 9 ? item_count: "9+"})</span>}  */}
                </Typography>
              </div>
            </div>
            <div style={{ width: 20, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ArrowDropDown />
            </div>
          </div>

          <Dialog open={open} fullWidth>
            <DialogTitle>
              <IconButton onClick={toggle} className={css.closeBtn}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent className={css.dialogScroll}>
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
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
