import { Box, Checkbox, Chip, FormControlLabel, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { CloudDownloadOutlined } from "@mui/icons-material";
import React from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { apiResourcePathById } from "../../api/extra";
import { ContentType } from "../../api/type";
import { d, t } from "../../locale/LocaleManager";
import { formattedTime } from "../../models/ModelContentDetailForm";
import { NeedTransilationMenuItem } from "../ContentEdit/Details";
const useStyles = makeStyles(({ palette }) => ({
  textFiled: {
    height: "112px",
    marginBottom: 20,
    "& .MuiInputBase-root": {
      height: "100%",
    },
  },
  fieldset: {
    marginTop: 32,
    marginBottom: 32,
  },
  keyword: {
    "& .MuiInputBase-input": {
      width: 0,
    },
  },
  chipCon: {
    width: "100%",
    overflowX: "auto",
    overflowY: "hidden",
    padding: "18.5px 14px",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  teacherManualBox: {
    width: "100%",
    minHeight: 56,
    padding: "15px 14px ",
    boxSizing: "border-box",
    marginTop: 32,
    marginBottom: 32,
    position: "relative",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: 4,
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
  },
  iconField: {
    cursor: "pointer",
    fontSize: 25,
    marginLeft: 10,
    color: "rgba(0, 0, 0, 0.87)",
  },
  fontColor: {
    color: palette.common.black,
  },
}));
interface ContentPreviewProps {
  contentPreview: EntityContentInfoWithDetails;
}
export function Detail(props: ContentPreviewProps) {
  const css = useStyles();
  const { contentPreview } = props;
  const colors = ["#009688", "#9c27b0", "#ffc107"];
  return (
    <>
      <TextField
        className={css.textFiled}
        margin="normal"
        fullWidth
        multiline
        disabled
        rows={2}
        label={d("Description").t("library_label_description")}
        variant="outlined"
        InputProps={{
          readOnly: true,
          style: { color: "rgba(0,0,0,1)" },
        }}
        value={contentPreview.description}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Created On").t("library_label_created_on")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={formattedTime(contentPreview.updated_at)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Author").t("library_label_author")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.author_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Program").t("library_label_program")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.program_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Subject").t("library_label_subject")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.subject_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Category").t("library_label_category")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.developmental_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Subcategory").t("library_label_subcategory")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.skills_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Visibility Settings").t("library_label_visibility_settings")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.publish_scope_name}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={t("library_label_duration")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.suggest_time}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Age").t("library_label_age")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.age_name?.join(",")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label={d("Grade").t("library_label_grade")}
            fullWidth
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
              style: { color: "rgba(0,0,0,1)" },
            }}
            value={contentPreview.grade_name?.join(",")}
          />
        </Grid>
      </Grid>
      {contentPreview.content_type === ContentType.material && (
        <TextField
          margin="normal"
          fullWidth
          disabled
          rows={2}
          label={d("Lesson Type").t("library_label_lesson_type")}
          variant="outlined"
          InputProps={{
            readOnly: true,
            style: { color: "rgba(0,0,0,1)" },
          }}
          value={contentPreview.lesson_type_name ? t(contentPreview.lesson_type_name as NeedTransilationMenuItem) : ""}
        />
      )}
      <Box
        className={css.fieldset}
        style={{
          position: "relative",
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              style={{
                position: "absolute",
                right: 0,
              }}
              disabled
              checked={contentPreview.self_study || false}
              color="primary"
            />
          }
          label={<span className={css.fontColor}>{d("Suitable for Self Study").t("library_label_self_study")}</span>}
          labelPlacement="start"
        />
      </Box>
      {contentPreview.content_type === ContentType.material && (
        <Box
          className={css.fieldset}
          style={{
            position: "relative",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                style={{
                  position: "absolute",
                  right: 0,
                }}
                disabled
                checked={contentPreview.draw_activity || false}
                color="primary"
              />
            }
            label={<span className={css.fontColor}>{d("Drawing Activity").t("library_label_drawing_activity")}</span>}
            labelPlacement="start"
          />
        </Box>
      )}
      <TextField
        className={css.keyword}
        margin="normal"
        fullWidth
        disabled
        label={d("Keywords").t("library_label_keywords")}
        variant="outlined"
        InputProps={{
          readOnly: true,
          style: { color: "rgba(0,0,0,1)" },
          startAdornment: (
            <InputAdornment position="start" className={css.chipCon}>
              {contentPreview.keywords?.map((value, index) => (
                <Chip
                  key={value + index}
                  label={value}
                  style={{
                    color: "#fff",
                    backgroundColor: colors[index % 3],
                    margin: 2,
                  }}
                />
              ))}
            </InputAdornment>
          ),
        }}
      ></TextField>
      {contentPreview.content_type === ContentType.plan && (
        <Box className={css.teacherManualBox}>
          {contentPreview.teacher_manual_batch?.map((file, index) => (
            <div key={file.id} className={css.fileItem}>
              <Typography component="div" noWrap variant="body1" style={{ color: "rgba(51,51,51,1)" }}>
                {file.name}{" "}
              </Typography>
              <a
                href={apiResourcePathById(contentPreview.teacher_manual_batch && contentPreview.teacher_manual_batch[index]?.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CloudDownloadOutlined className={css.iconField} />
              </a>
            </div>
          ))}

          <div
            style={{
              alignItems: "center",
              color: "rgba(0, 0, 0, 0.54)",
              display: contentPreview.teacher_manual_batch && contentPreview.teacher_manual_batch?.length > 0 ? "none" : "flex",
            }}
          >
            {d("Teacher Manual").t("library_label_teacher_manual")}
          </div>
        </Box>
      )}
    </>
  );
}
