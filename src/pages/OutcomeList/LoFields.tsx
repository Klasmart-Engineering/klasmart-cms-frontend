import { CheckboxGroup, CheckboxGroupContext } from "@components/CheckboxGroup";
import { d } from "@locale/LocaleManager";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, makeStyles, Typography } from "@material-ui/core";
import { formattedTime } from "@models/ModelContentDetailForm";
import { formattedNowOrTime } from "@models/ModelOutcomeDetailForm";
import { ChangeEvent, DOMAttributes, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DownloadOutcomeItemResult, DownloadOutcomeListResult, FieldsProps } from "./types";
const useStyles = makeStyles((theme) => ({
  fieldsCon: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
  },
  fieldsItem: {
    width: "48%",
  },
  title: {
    borderBottom: "1px solid #eeeeee",
  },
  okBtn: {
    marginLeft: "40px !important",
  },
  downloadA: {
    display: "block",
    textDecoration: "none", 
    color: "#fff", 
    width: "calc(100% + 16px)", 
    height: "calc(100% + 6px)", 
  }
}))
const FIELDS = "FIELDS";
export interface LoFieldsProps {
  open: boolean;
  list: DownloadOutcomeListResult;
  defaultFields: string[];
  onClose: () => void;
  onBulkDownload: ExportListToCSVBtnProps["onClick"];
  onChangeFields: (fields: LoFieldsProps["defaultFields"]) => void;
}
export function LoFields(props: LoFieldsProps) {
  const css = useStyles();
  const { open, list, defaultFields, onClose, onBulkDownload, onChangeFields } = props;
  const { control, watch } = useForm();
  const values = watch()[FIELDS];
  const outcomeFields: FieldsProps[] = useMemo(() => {
    return [
      { label: d("Learning Outcome Name").t("assess_label_learning_outcome_name"), value: "outcome_name", checked: true, readonly: false },
      { label: d("Short Code").t("assess_label_short_code"), value: "shortcode", checked: true, readonly: false },
      { label: d("Assumed").t("assess_label_assumed"), value: "assumed", checked: false, readonly: false },
      { label: d("Score Threshold").t("learning_outcome_label_threshold"), value: "score_threshold", checked: true, readonly: false },
      { label: d("Created On").t("library_label_created_on"), value: "created_at", checked: true, readonly: false },
      { label: d("Author").t("library_label_author"), value: "author", checked: false, readonly: false },
      { label: d("Program").t("assess_label_program"), value: "program", checked: true, readonly: true },
      { label: d("Subject").t("assess_label_subject"), value: "subject", checked: true, readonly: true },
      { label: d("Category").t("library_label_category"), value: "category", checked: true, readonly: true },
      { label: d("Subcategory").t("library_label_subcategory"), value: "subcategory", checked: true, readonly: true },
      { label: d("Age").t("assess_label_age"), value: "age", checked: false, readonly: false },
      { label: d("Grade").t("assess_label_grade"), value: "grade", checked: false, readonly: false },
      { label: d("Learning Outcome Set").t("assess_set_learning_outcome_set"), value: "sets", checked: false, readonly: false },
      { label: d("Keywords").t("assess_label_keywords"), value: "keywords", checked: false, readonly: false },
      { label: d("Milestones").t("assess_label_milestone"), value: "milestones", checked: false, readonly: false },
      { label: d("Description").t("assess_label_description"), value: "description", checked: false, readonly: false}
    ];
  }, [])
  const selectedFields = useMemo(() => {
    return outcomeFields.map(item => {
      const selectedValues = values ? values : defaultFields;
      return {
        ...item,
        checked: selectedValues.indexOf(item.value) >= 0 ? true : false
      }
    })
  }, [defaultFields, outcomeFields, values]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>,selectedContentGroupContext: CheckboxGroupContext) => {
    selectedContentGroupContext.registerChange(e);
    onChangeFields(watch()[FIELDS]);
  }
  return (
    <Dialog open={open} fullWidth maxWidth={"sm"}>
      <DialogTitle className={css.title}>
        {"Download"}
      </DialogTitle>
      <DialogContent>
        <div className={css.fieldsCon}>
          <Typography>
            {"Selected which items to include"}
            {list?.length}
            {`("There are to download")`}
          </Typography>
          <Controller
            name={FIELDS}
            control={control}
            defaultValue={defaultFields}
            render={({ ref, ...props }) => (
              <CheckboxGroup
                {...props}
                render={(selectedContentGroupContext) => (
                  <div {...{ ref }}>
                    {outcomeFields.map((item) => (
                      <FormControlLabel
                        key={item.value}
                        disabled={item.readonly}
                        className={css.fieldsItem}
                        control={
                          <Checkbox
                            color="primary"
                            value={item.value}
                            checked={selectedContentGroupContext.hashValue[item.value] || false}
                            onChange={(e) => handleChange(e, selectedContentGroupContext)}
                          />
                        }
                        label={item.label}
                      />
                    ))}
                  </div>
                )}
              />
            )}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary" variant="outlined">
          {d("CANCEL").t("general_button_CANCEL")}
        </Button>
        <ExportListToCSVBtn
          list={list}
          fields={selectedFields}
          label={d("CONFIRM").t("general_button_CONFIRM")}
          onClick={onBulkDownload}
        />
      </DialogActions>
    </Dialog>
  )
}

export function useLoFields() {
  const [active, setActive] = useState(false);
  const [loFieldsShowIndex, setLoFieldsShowIndex] = useState(0);
  return useMemo(
    () => ({
      loFieldsShowIndex,
      loFieldsActive: active,
      openLoFields: () => {
        setLoFieldsShowIndex(loFieldsShowIndex + 1);
        setActive(true);
      },
      closeLoFields: () => {
        setActive(false);
      },
    }),
    [active, loFieldsShowIndex]
  );
}

export interface ExportListToCSVBtnProps {
  list: DownloadOutcomeListResult;
  fields: FieldsProps[];
  label: string;
  onClick: () => boolean;
}
export function ExportListToCSVBtn(props: ExportListToCSVBtnProps) {
  const css = useStyles();
  const { list, fields, label, onClick } = props;
  const loName = list[0] && list[0].outcome_name?.split(" ").join("_").slice(0, 20);
  const downloadname = `${formattedNowOrTime()}_${loName}`
  const uri = useMemo(() => {
    let title: string  = "";
    fields.forEach((item) => {
      if(item.checked) {
        title += `${item.label},\t`;
      }
    });
    const data = 
      list.map(item => {
        const temp: Record<string, any> =  {};
        fields.forEach(fItem => {
          if(fItem.checked) {
            const key = fItem.value as keyof DownloadOutcomeItemResult;
            temp[key] = item[key];
          }
        })
        return {
          ...temp
        }
      });
    let str: string = `${title}\n`;
    data.forEach(item => {
      const keys = Object.keys(item)
      keys.forEach(kItem => {
        const values = item[kItem];
        if(values instanceof Array) {
          str += `\t${values.join(";")},\t`
        } else if (kItem === "created_at") {
          str += `\t${formattedTime(values)},\t`
        } else if (kItem === "score_threshold") {
          str += `\t${(values*100).toFixed(0)}%,\t`
        } else {
          str += `\t${values.toString()},\t`
        }
      })
      str += "\n";
    });
    return "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
  }, [fields, list])
  const handleClick: DOMAttributes<HTMLAnchorElement>["onClick"] = (e) => {
    if(onClick()) return;
    e.preventDefault();
  }
  return (
    <Button
      color="primary"
      variant="contained"
      className={css.okBtn}
      href={uri}
      download={`${downloadname}.csv`}
      onClick={handleClick}
      >
      {label}
    </Button>
  )
}
