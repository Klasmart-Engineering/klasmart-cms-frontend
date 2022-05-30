import { TooltipWhite } from "@components/TreeViewFolder/TreeNode";
import { Button, createStyles, Grid, Hidden, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import React from "react";
import { EntityFolderContentData, EntityFolderItemInfo } from "../../api/api.auto";
import PermissionType from "../../api/PermissionType";
import folderIconUrl from "../../assets/icons/foldericon.svg";
import prevPageUrl from "../../assets/icons/folderprev.svg";
import { usePermission } from "../../hooks/usePermission";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      width: "86%",
      marginBottom: 40,
      [theme.breakpoints.only("sm")]: {
        width: "90%",
      },
      [theme.breakpoints.only("xs")]: {
        width: "100%",
      },
      position: "relative",
    },
    cardMedia: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    prevImg: {
      width: "100%",
      maxWidth: 160,
    },
    folderName: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        marginLeft: 10,
      },
    },
    despWord: {
      fontSize: 18,
      color: "#666666",
      textAlign: "right",
      flex: 1,
      lineHeight: "22px",
      [theme.breakpoints.down("sm")]: {
        fontSize: 14,
      },
    },
    infoWord: {
      fontSize: 22,
      flex: 3,
      marginLeft: 5,
      lineHeight: "22px",
      color: "#000000",
      overflow: "hidden",
      display: "-webkit-box",
      textOverflow: "ellipsis",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
      wordBreak: "break-word",
      [theme.breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    folderInfoCon: {
      width: "50%",
      display: "flex",
      marginTop: 10,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        fontSize: 16,
      },
    },
    titleCon: {
      display: "flex",
    },
    mbBtnCon: {
      margin: "10px 0",
      textAlign: "right",
    },
  })
);

interface BackToPrevePageProps {
  onGoBack: () => any;
  parentFolderInfo: EntityFolderItemInfo;
  onRenameFolder: (content: NonNullable<EntityFolderContentData>) => any;
  isEdit: boolean;
}
export function BackToPrevPage(props: BackToPrevePageProps) {
  const css = useStyles();
  const { onGoBack, parentFolderInfo, onRenameFolder, isEdit } = props;
  const keywords = parentFolderInfo.keywords ? parentFolderInfo.keywords.join(",") : "";
  const perm = usePermission([PermissionType.create_folder_289]);
  const folderInfo = () => {
    return (
      <>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{d("Created By").t("library_label_created_by")}:</Typography>
          <Typography className={css.infoWord}>{parentFolderInfo.creator_name}</Typography>
        </div>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{d("Keywords").t("library_label_keywords")}:</Typography>
          <TooltipWhite placement="top" arrow title={keywords}>
            <Typography className={css.infoWord}>{keywords}</Typography>
          </TooltipWhite>
        </div>
        <div className={css.folderInfoCon}>
          <Typography className={css.despWord}>{d("Description").t("library_label_description")}:</Typography>
          <TooltipWhite placement="top" arrow title={parentFolderInfo.description || ""}>
            <Typography className={css.infoWord}>{parentFolderInfo.description}</Typography>
          </TooltipWhite>
        </div>
        {isEdit && (
          <div className={css.folderInfoCon}>
            <Typography className={css.despWord}>{d("Contains").t("library_label_contains")}:</Typography>
            <Typography className={css.infoWord}>
              {parentFolderInfo.items_count} {d("items").t("library_label_items")}. {parentFolderInfo.available}{" "}
              {d("visible").t("library_label_visible")}
            </Typography>
          </div>
        )}
      </>
    );
  };
  return (
    <>
      <Grid container spacing={2} style={{ borderBottom: "1px solid #e0e0e0", marginBottom: 10, width: "96%" }}>
        <Hidden only={["xs"]}>
          <div style={{ width: "25%" }}>
            <div className={css.card}>
              <div className={css.cardMedia} style={{ marginTop: 10, cursor: "pointer" }} onClick={onGoBack}>
                <img className={css.prevImg} src={prevPageUrl} alt="" />
              </div>
            </div>
          </div>
          <div style={{ width: "75%", paddingBottom: "8px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ width: "100%" }}>
              <div className={css.folderName} style={{ display: "flex" }}>
                <img src={folderIconUrl} alt="" style={{ width: 48, height: 48 }} />
                <TooltipWhite placement="top" arrow title={parentFolderInfo.name || ""}>
                  <Typography component="h6" variant="h6" noWrap>
                    {parentFolderInfo.name}
                  </Typography>
                </TooltipWhite>
              </div>
            </div>
            <Grid item container>
              {folderInfo()}
            </Grid>
            {isEdit && (
              <Grid item container justify="flex-end" style={{ marginTop: 10 }}>
                {perm.create_folder_289 && (
                  <Button variant="outlined" color="primary" onClick={() => onRenameFolder(parentFolderInfo)}>
                    {d("Edit").t("library_label_edit")}
                  </Button>
                )}
              </Grid>
            )}
          </div>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]}>
          <Grid item style={{ width: "100%" }}>
            <div className={css.titleCon}>
              <img style={{ width: 48, height: 48, cursor: "pointer" }} src={prevPageUrl} alt="" onClick={onGoBack} />
              <div className={css.folderName} style={{ width: "90%" }}>
                <img src={folderIconUrl} alt="" style={{ width: 24, height: 24 }} />
                <TooltipWhite placement="top" arrow title={parentFolderInfo.name || ""}>
                  <Typography variant="h6" noWrap style={{ width: "100%" }}>
                    {parentFolderInfo.name}
                  </Typography>
                </TooltipWhite>
                {isEdit && perm.create_folder_289 && (
                  <IconButton onClick={() => onRenameFolder(parentFolderInfo)}>
                    <EditOutlinedIcon color="primary" />
                  </IconButton>
                )}
              </div>
            </div>
            {folderInfo()}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
}
