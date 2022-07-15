import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import React, { useMemo, useState } from "react";
import { Controller, ControllerProps, UseFormMethods } from "react-hook-form";
import { EntityFolderContentData } from "../../api/api.auto";
import { decodeArray, FormattedTextField } from "../../components/FormattedTextField";
import { LButton, LButtonProps } from "../../components/LButton";
import { d } from "../../locale/LocaleManager";
import { ContentListForm, ContentListFormKey } from "./types";
const useStyles = makeStyles((theme) =>
  createStyles({
    dialog: {
      minWidth: "50vw",
    },
    dialogActions: {
      width: "100%",
      padding: "16px 22px",
      display: "flex",
      justifyContent: "flex-end",
    },
    okBtn: {
      marginLeft: 40,
    },
    dialogContent: {
      textAlign: "center",
      borderBottom: 0,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      margin: "auto",
      width: "90%",
    },
    inputCon: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      marginBottom: 30,
    },
    textareaCon: {
      alignItems: "start",
    },
    textareaLabel: {
      marginTop: 10,
    },
    typography: {
      flex: 1,
      marginRight: 30,
      textAlign: "right",
    },
    textField: {
      width: "75%",
      flex: 3,
    },
    star: {
      color: "#d32f2f",
      position: "absolute",
      left: "25%",
      fontSize: 24,
    },
  })
);

const REMARK = "REMARK";
const KEYWORDS = "KEYWORDS";

export enum FolderFormType {
  create = "create",
  edit = "edit",
}
export interface FolderFormProps {
  open: boolean;
  type: FolderFormType;
  onClose: () => any;
  onAddFolder: LButtonProps["onClick"];
  onRenameFolder: LButtonProps["onClick"];
  folderForm?: EntityFolderContentData;
  formMethods: UseFormMethods<ContentListForm>;
  rules?: ControllerProps<"input">["rules"];
}
export function FolderForm(props: FolderFormProps) {
  const css = useStyles();
  const { open, type, onClose, onAddFolder, onRenameFolder, folderForm, formMethods, rules } = props;
  const { control, errors } = formMethods;
  return (
    <Dialog open={open} fullWidth={true} className={css.dialog}>
      <DialogTitle>
        {type === FolderFormType.edit ? d("Edit Folder").t("library_label_edit_folder") : d("New Folder").t("library_label_new_folder")}
      </DialogTitle>
      <DialogContent dividers className={css.dialogContent}>
        <div className={css.form}>
          <div
            className={css.inputCon}
            style={{
              position: "relative",
            }}
          >
            <Typography className={css.typography}>{d("Folder Name").t("library_label_folder_name")}</Typography>
            <Typography className={css.star}>*</Typography>
            <Controller
              name={ContentListFormKey.FOLDER_NAME}
              as={TextField}
              control={control}
              defaultValue={folderForm?.name || ""}
              className={css.textField}
              autoFocus={true}
              rules={{
                ...rules,
              }}
              error={errors.FOLDER_NAME ? true : false}
              fullWidth
              variant="outlined"
              helperText={errors["FOLDER_NAME"]?.message}
            />
          </div>
          <div className={clsx(css.inputCon, css.textareaCon)}>
            <Typography className={clsx(css.typography, css.textareaLabel)}>{d("Description").t("library_label_description")}</Typography>
            <Controller
              name={REMARK}
              control={control}
              as={TextField}
              defaultValue={folderForm?.description || ""}
              className={css.textField}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </div>
          <div className={css.inputCon}>
            <Typography className={css.typography}>{d("Keywords").t("library_label_keywords")}</Typography>
            <Controller
              name={KEYWORDS}
              control={control}
              as={FormattedTextField}
              decode={decodeArray}
              defaultValue={folderForm?.keywords || []}
              className={css.textField}
              fullWidth
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className={css.dialogActions}>
          <Button color="primary" variant="outlined" onClick={onClose}>
            {d("Cancel").t("library_label_cancel")}
          </Button>
          <LButton
            color="primary"
            variant="contained"
            className={css.okBtn}
            onClick={type === FolderFormType.edit ? onRenameFolder : onAddFolder}
          >
            {d("OK").t("library_label_ok")}
          </LButton>
        </div>
      </DialogActions>
    </Dialog>
  );
}

export function useFolderForm() {
  const [active, setActive] = useState(false);
  const [folderFormShowIndex, setFolderFormShowIndex] = useState(2);
  const [type, setType] = useState(FolderFormType.create);
  return useMemo(
    () => ({
      folderFormShowIndex,
      folderFormActive: active,
      type,
      setType,
      openFolderForm: () => {
        setFolderFormShowIndex(folderFormShowIndex + 1);
        setActive(true);
      },
      closeFolderForm: () => setActive(false),
    }),
    [setActive, active, type, folderFormShowIndex, setFolderFormShowIndex]
  );
}
