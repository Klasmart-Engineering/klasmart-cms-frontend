import { EntityContentInfoWithDetails, EntityTeacherManualFile } from "@api/api.auto";
import { apiResourcePathById } from "@api/extra";
import { CropImage } from "@components/CropImage";
import { decodeArray, decodeOneItemArray, encodeOneItemArray, FormattedTextField, frontTrim } from "@components/FormattedTextField";
import { FileSizeUnit, MultipleUploader, MultipleUploaderErrorType } from "@components/MultipleUploader";
import { SingleUploader } from "@components/SingleUploader";
import useQueryCms from "@hooks/useQueryCms";
import { LangRecordId } from "@locale/lang/type";
import { d, t } from "@locale/LocaleManager";
import { ContentDetailForm, formattedTime, toMapGroup } from "@models/ModelContentDetailForm";
import { ModelLessonPlan, Segment } from "@models/ModelLessonPlan";
import { CreateAllDefaultValueAndKeyResult } from "@models/ModelMockOptions";
import { AccessTime, CancelRounded, CloudUploadOutlined, InfoOutlined } from "@mui/icons-material";
import { Autocomplete } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  CircularProgressProps,
  createTheme,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  OutlinedInput,
  TextField,
  ThemeProvider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import { LinkedMockOptions, LinkedMockOptionsItem } from "@reducers/contentEdit/programsHandler";
import { actError } from "@reducers/notify";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
// import { HtmlTooltip } from "../Schedule/ScheduleAttachment";
import { fileFormat } from "./MediaAssetsEdit";

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  details: {
    minHeight: 800,
    [breakpoints.down("sm")]: {
      minHeight: 698,
    },
  },
  fieldset: {
    marginTop: 32,
  },
  fieldsetReject: {
    color: palette.error.main,
    marginBottom: 32,
  },
  halfFieldset: {
    marginTop: 32,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  thumbnailImg: {
    width: 260,
    height: 132,
  },
  thumbnailButton: {
    height: 56,
    marginRight: "auto",
  },
  thumbnailProgressText: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconField: {
    position: "absolute",
    bottom: 15,
    [breakpoints.down("sm")]: {
      bottom: 9,
    },
    cursor: "pointer",
    fontSize: 25,
    right: 10,
  },
  progress: {
    width: 24,
    height: 24,
  },
  iconLeft: {
    marginLeft: 10,
  },
  fileItem: {
    display: "flex",
    alignItems: "center",
  },
  teacherManualBox: {
    width: "100%",
    minHeight: 56,
    padding: "15px 40px 15px 14px ",
    [breakpoints.down("sm")]: {
      minHeight: 40,
      padding: "10.5px 40px 10.5px 14px",
    },
    boxSizing: "border-box",
    marginTop: 32,
    position: "relative",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    borderRadius: 4,
  },
  cancel: {
    color: "rgba(102,102,102,1)",
    marginLeft: 10,
    cursor: "pointer",
  },
  valueColor: {
    color: "rgba(0, 0, 0, 0.54)",
  },
  linearProcess: {
    width: 32,
    margin: "0 10px",
  },
  groupMenu: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "0.87rem",
    boxSizing: "border-box",
    fontWeight: 500,
    lineHeight: "48px",
    paddingLeft: 16,
  },
}));

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: "#FFFFFF",
    maxWidth: 260,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}))(Tooltip);

export function ProgressWithText(props: CircularProgressProps) {
  const css = useStyles();
  return (
    <Box position="relative" display="inline-flex" alignItems="center">
      <CircularProgress className={css.thumbnailImg} variant="determinate" {...props} />
      <Box className={css.thumbnailProgressText}>
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value || 0)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
export type NeedTransilationMenuItem =
  | "library_label_visibility_school"
  | "library_label_visibility_organization"
  | "library_label_test"
  | "library_label_not_test";
interface SuggestTimeProps {
  value?: number;
  onChange?: (value: SuggestTimeProps["value"]) => any;
  watch: UseFormMethods["watch"];
  disabled: boolean;
}
const SuggestTime = forwardRef<HTMLDivElement, SuggestTimeProps>((props, ref) => {
  const { value, onChange, watch, disabled } = props;
  const css = useStyles();
  const { lesson } = useParams<ContentEditRouteParams>();
  const [suggestTime, SetSuggestTime] = useState(String(value));
  const min = ModelLessonPlan.sumSuggestTime(watch("data") as Segment);
  const suggestTimeFun = useMemo(
    () => (value: string | number) => {
      const result = Number(value) > min ? Number(value) : min;
      return Number(result);
    },
    [min]
  );
  const handleBlur = useCallback(() => {
    if (onChange && suggestTime !== undefined) {
      if (lesson === "plan") {
        onChange(suggestTimeFun(suggestTime));
        SetSuggestTime(String(suggestTimeFun(suggestTime)));
      } else {
        SetSuggestTime(String(Number(suggestTime)));
        onChange(Number(suggestTime));
      }
    }
  }, [lesson, onChange, suggestTime, suggestTimeFun]);
  return (
    <TextField
      ref={ref}
      type="number"
      fullWidth
      className={css.fieldset}
      label={lesson === "plan" ? t("library_label_plan_duration") : t("library_label_duration")}
      disabled={disabled}
      value={suggestTime}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => SetSuggestTime(String(Math.ceil(Number(e.target.value))))}
      onBlur={handleBlur}
      inputProps={{ min: 0 }}
      onFocus={(e) => SetSuggestTime(String(Math.ceil(Number(e.target.value)) || ""))}
    />
  );
});
export const menuItemList = (list?: LinkedMockOptionsItem[]) =>
  list &&
  list.map((item) => (
    <MenuItem key={item.id} value={item.id}>
      {item.name}
    </MenuItem>
  ));

const NeedTransilationMenuItemList = (list: LinkedMockOptionsItem[]) =>
  list &&
  list.map((item) => (
    <MenuItem key={item.id} value={item.id}>
      {t(item.name as NeedTransilationMenuItem)}
    </MenuItem>
  ));

const rejectReasonTransilation = (reson?: string[], remark?: string) => {
  const reson_remark = reson && reson.map((item) => t(item as LangRecordId));
  if (reson_remark && remark) reson_remark.push(remark);
  return reson_remark ? reson_remark : remark && [remark];
};
export interface DetailsProps {
  allDefaultValueAndKey: CreateAllDefaultValueAndKeyResult;
  contentDetail: EntityContentInfoWithDetails;
  uploadThumnail?: Function;
  formMethods: UseFormMethods<ContentDetailForm>;
  linkedMockOptions: LinkedMockOptions;
  lesson_types: LinkedMockOptionsItem[];
  visibility_settings: LinkedMockOptionsItem[];
  onChangeProgram: (value: NonNullable<ContentDetailForm["program"]>) => any;
  onChangeDevelopmental: (value: NonNullable<ContentDetailForm["developmental"]>) => any;
  onChangeSubject: (value: string[]) => any;
  disabled: boolean;
}
export default function Details(props: DetailsProps) {
  const {
    allDefaultValueAndKey,
    contentDetail,
    formMethods: {
      control,
      errors,
      watch,
      setValue,
      formState: { isDirty },
    },
    linkedMockOptions,
    visibility_settings,
    lesson_types,
    onChangeDevelopmental,
    onChangeProgram,
    onChangeSubject,
    disabled,
  } = props;
  const css = useStyles();
  const { lesson } = useParams<ContentEditRouteParams>();
  const { id } = useQueryCms();
  const defaultTheme = useTheme();
  const dispatch = useDispatch();
  const sm = useMediaQuery(defaultTheme.breakpoints.down("sm"));
  // const groupMenuItemList = (list?: LinkedMockOptionsItem[]) => {
  //   const newArr: JSX.Element[] = [];
  //   const newList = toMapVisibilitySettings(list);
  //   newList.length &&
  //     newList.forEach((item, index) => {
  //       index === 0 && newArr.push(<ListSubheader key={`${item.id}+${index}`}>{toMapGroup(item.group)}</ListSubheader>);
  //       index !== 0 &&
  //         item.group !== newList[index - 1].group &&
  //         newArr.push(<ListSubheader key={`${item.id}+${index}`}>{toMapGroup(item.group)}</ListSubheader>);
  //       newArr.push(
  //         <MenuItem style={{ paddingLeft: 28 }} key={item.id} value={item.id}>
  //           {item.name}
  //         </MenuItem>
  //       );
  //     });
  //   return newArr;
  // };
  const defaultVisibilityValue = (defaultValue: string[]): LinkedMockOptionsItem[] => {
    const arr: LinkedMockOptionsItem[] = [];
    defaultValue.forEach((item) => {
      const aa = visibility_settings.find((i) => i.id === item);
      aa && arr.push(aa);
    });
    return arr;
  };
  const teacherInfo = (
    <div
      style={{
        color: "#000",
      }}
    >
      <span
        style={{
          fontWeight: 700,
        }}
      >
        {d("Max Size").t("library_label_max_size")}
      </span>
      : 500MB
      <br />
      <span
        style={{
          fontWeight: 700,
        }}
      >
        {d("Supported Format").t("library_label_supported_format")}
      </span>
      : pdf,mp3,wav
      <br />
      <span
        style={{
          fontWeight: 700,
        }}
      >
        {d("Max File Number").t("library_label_max_file_number")}
      </span>
      : 5
    </div>
  );
  const min = ModelLessonPlan.sumSuggestTime(watch("data") as Segment);
  const suggest_timeKey = `${contentDetail.suggest_time}${min}`;
  const suggestTimeFun = useMemo(
    () => (value: string | number) => {
      const result = Number(value) > min ? Number(value) : min;
      return result;
    },
    [min]
  );
  const suggestTimeFunEdit = useMemo(
    () => (value: string | number) => {
      if (!isDirty) return Number(value);
      const watchTime = watch("suggest_time") || 0;
      const result = watchTime > min ? watchTime : min;
      return result;
    },
    [isDirty, min, watch]
  );
  const size = sm ? "small" : "medium";
  const theme = createTheme(defaultTheme, {
    props: {
      MuiTextField: {
        size,
        fullWidth: true,
      },
      MuiFormControl: {
        size,
        fullWidth: true,
      },
      MuiButton: {
        size,
      },
      MuiSvgIcon: {
        fontSize: sm ? "small" : "medium",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Box component="form" p="7.8% 8.5%" className={css.details}>
        {contentDetail.publish_status === "rejected" && (
          <FormControl variant="outlined">
            <InputLabel error variant="outlined" htmlFor="rejectReason">
              {d("Reason").t("library_label_reason")}
            </InputLabel>
            <OutlinedInput
              readOnly
              className={css.fieldsetReject}
              error
              id="rejectReason"
              multiline
              value={rejectReasonTransilation(contentDetail.reject_reason, contentDetail.remark)}
              label={d("Reason").t("library_label_reason")}
            ></OutlinedInput>
          </FormControl>
        )}
        <Controller
          as={FormattedTextField}
          control={control}
          name="name"
          fullWidth
          label={lesson === "material" ? d("Material Name").t("library_label_material_name") : d("Plan Name").t("library_label_plan_name")}
          required
          encode={frontTrim}
          decode={frontTrim}
          defaultValue={allDefaultValueAndKey.name?.value}
          key={allDefaultValueAndKey.name?.key}
          rules={{
            required: true,
          }}
          error={errors.name ? true : false}
          helperText=""
          disabled={disabled}
        />
        <Controller
          name="thumbnail"
          defaultValue={allDefaultValueAndKey.thumbnail?.value}
          key={allDefaultValueAndKey.thumbnail?.key}
          control={control}
          render={(props) => (
            <CropImage
              aspectRatio={16 / 9}
              render={({ crop }) => (
                <SingleUploader
                  partition="thumbnail"
                  accept={fileFormat.image.join()}
                  transformFile={crop}
                  {...props}
                  render={({ uploady, item, btnRef, value, isUploading }) => (
                    <Box className={css.fieldset} display="flex">
                      <Button
                        className={css.thumbnailButton}
                        ref={btnRef}
                        size={sm ? "medium" : "large"}
                        variant="contained"
                        component="span"
                        color="primary"
                        endIcon={<CloudUploadOutlined />}
                        disabled={disabled}
                      >
                        {d("Thumbnail").t("library_label_thumbnail")}
                      </Button>
                      {isUploading && <ProgressWithText value={item?.completed} />}
                      {!isUploading && value && <img className={css.thumbnailImg} alt="thumbnail" src={apiResourcePathById(value)} />}
                    </Box>
                  )}
                />
              )}
            />
          )}
        />
        {contentDetail.id && (
          <Box>
            <TextField
              defaultValue={formattedTime(contentDetail.updated_at)}
              key={allDefaultValueAndKey.updated_at?.value}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Created On").t("library_label_created_on")}
            ></TextField>
            <TextField
              defaultValue={allDefaultValueAndKey.author_name?.value}
              key={allDefaultValueAndKey.author_name?.key}
              className={sm ? css.fieldset : css.halfFieldset}
              fullWidth={sm}
              disabled
              label={d("Author").t("library_label_author")}
            ></TextField>
          </Box>
        )}

        <Controller
          control={control}
          name="suggest_time"
          defaultValue={
            lesson === "plan"
              ? id
                ? suggestTimeFunEdit(allDefaultValueAndKey.suggest_time?.value || 0)
                : suggestTimeFun(watch("suggest_time") || 0)
              : allDefaultValueAndKey.suggest_time?.value
          }
          key={lesson === "plan" ? suggest_timeKey : allDefaultValueAndKey.suggest_time?.key}
          render={({ ref, ...props }) => <SuggestTime {...props} ref={ref} watch={watch} disabled={disabled} />}
        />

        <Box>
          <Controller
            name="program"
            defaultValue={allDefaultValueAndKey.program?.value}
            key={allDefaultValueAndKey.program?.key}
            control={control}
            rules={{
              validate: (value) => !!value,
            }}
            render={(props) => (
              <TextField
                select
                error={errors.program ? true : false}
                className={sm ? css.fieldset : css.halfFieldset}
                label={d("Program").t("library_label_program")}
                disabled={disabled}
                {...props}
                onChange={(e) => {
                  onChangeProgram(e.target.value);
                  props.onChange(e.target.value);
                }}
                fullWidth={sm}
                required
              >
                {menuItemList(linkedMockOptions.program || [])}
              </TextField>
            )}
          />
          <Controller
            name="subject"
            defaultValue={allDefaultValueAndKey.subject?.value || []}
            key={allDefaultValueAndKey.subject?.key}
            control={control}
            rules={{
              validate: (value) => value.length > 0,
            }}
            render={(props) => (
              <TextField
                select
                SelectProps={{
                  multiple: true,
                }}
                error={errors.subject ? true : false}
                className={sm ? css.fieldset : css.halfFieldset}
                label={d("Subject").t("library_label_subject")}
                disabled={disabled}
                {...props}
                onChange={(e) => {
                  const value = e.target.value as unknown as string[];
                  value.length > 0 && onChangeSubject(value);
                  value.length > 0 && props.onChange(value);
                }}
                fullWidth={sm}
                required
              >
                {menuItemList(linkedMockOptions.subject || [])}
              </TextField>
            )}
          />
        </Box>
        <Box>
          <Controller
            name="developmental"
            defaultValue={allDefaultValueAndKey.developmental?.value}
            key={allDefaultValueAndKey.developmental?.key}
            control={control}
            rules={{
              validate: (value) => !!value[0],
            }}
            render={(props) => (
              <FormattedTextField
                select
                error={errors.developmental ? true : false}
                className={sm ? css.fieldset : css.halfFieldset}
                label={d("Category").t("library_label_category")}
                disabled={disabled}
                encode={encodeOneItemArray}
                decode={decodeOneItemArray}
                {...props}
                onChange={(value: ReturnType<typeof decodeOneItemArray>) => {
                  onChangeDevelopmental(value);
                  props.onChange(value);
                }}
                fullWidth={sm}
                required
              >
                {menuItemList(linkedMockOptions.developmental || [])}
              </FormattedTextField>
            )}
          />
          <Controller
            as={TextField}
            name="skills"
            defaultValue={allDefaultValueAndKey.skills?.value || []}
            key={allDefaultValueAndKey.skills?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Subcategory").t("library_label_subcategory")}
            disabled={disabled}
          >
            {menuItemList(linkedMockOptions.skills || [])}
          </Controller>
        </Box>
        <Box>
          <Controller
            as={TextField}
            name="age"
            defaultValue={allDefaultValueAndKey.age?.value || []}
            key={allDefaultValueAndKey.age?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Age").t("library_label_age")}
            disabled={disabled}
          >
            {menuItemList(linkedMockOptions.age || [])}
          </Controller>
          <Controller
            as={TextField}
            name="grade"
            defaultValue={allDefaultValueAndKey.grade?.value || []}
            key={allDefaultValueAndKey.grade?.key}
            control={control}
            select
            SelectProps={{
              multiple: true,
            }}
            className={sm ? css.fieldset : css.halfFieldset}
            fullWidth={sm}
            label={d("Grade").t("library_label_grade")}
            disabled={disabled}
          >
            {menuItemList(linkedMockOptions.grade || [])}
          </Controller>
        </Box>
        {/* <Controller
          as={TextField}
          select
          SelectProps={{
            multiple: true,
          }}
          className={css.fieldset}
          label={d("Visibility Settings").t("library_label_visibility_settings")}
          disabled={disabled}
          name="publish_scope"
          required
          defaultValue={allDefaultValueAndKey.publish_scope?.value || []}
          key={allDefaultValueAndKey.publish_scope?.key}
          control={control}
          rules={{
            validate: (value) => value.length > 0,
          }}
          error={errors.publish_scope ? true : false}
          helperText=""
        >
          {groupMenuItemList(visibility_settings)}
        </Controller> */}
        <Autocomplete
          id="grouped-demo"
          multiple
          options={visibility_settings}
          groupBy={(option: LinkedMockOptionsItem) => toMapGroup(option.group) as string}
          getOptionLabel={(option: LinkedMockOptionsItem) => option.name as string}
          isOptionEqualToValue={(option: LinkedMockOptionsItem, value: LinkedMockOptionsItem) => option.id === value.id}
          onChange={(e: any, newValue) => {
            console.log(newValue);
            setValue(
              "publish_scope",
              newValue.map((item) => item.id),
              { shouldDirty: true }
            );
          }}
          defaultValue={defaultVisibilityValue(allDefaultValueAndKey.publish_scope?.value || []) || []}
          renderInput={(params) => (
            <Controller
              as={TextField}
              name="publish_scope"
              className={css.fieldset}
              control={control}
              {...params}
              label={d("Visibility Settings").t("library_label_visibility_settings")}
              variant="outlined"
              required={true}
              rules={{
                validate: (value) => value.length > 0,
              }}
              error={errors.publish_scope ? true : false}
              defaultValue={allDefaultValueAndKey.publish_scope?.value || []}
              key={allDefaultValueAndKey.publish_scope?.key}
            />
          )}
        />
        {lesson === "material" && (
          <Controller
            as={TextField}
            select
            fullWidth
            className={css.fieldset}
            label={d("Lesson Type").t("library_label_lesson_type")}
            disabled={disabled}
            name="lesson_type"
            defaultValue={allDefaultValueAndKey.lesson_type?.value}
            key={allDefaultValueAndKey.lesson_type?.key}
            control={control}
          >
            {NeedTransilationMenuItemList(lesson_types)}
          </Controller>
        )}
        <Controller
          name="self_study"
          defaultValue={allDefaultValueAndKey.self_study?.value}
          key={allDefaultValueAndKey.self_study?.key}
          render={(props) => (
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
                    checked={props.value || false}
                    onChange={(e) => props.onChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={d("Suitable for Self Study").t("library_label_self_study")}
                disabled={disabled}
                style={{
                  color: "rgba(0,0,0,0.6)",
                }}
                labelPlacement="start"
              />
            </Box>
          )}
          control={control}
        />
        {lesson === "material" && (
          <Controller
            name="draw_activity"
            defaultValue={allDefaultValueAndKey.draw_activity?.value}
            key={allDefaultValueAndKey.draw_activity?.key}
            render={(props) => (
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
                      checked={props.value || false}
                      onChange={(e) => props.onChange(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={d("Drawing Activity").t("library_label_drawing_activity")}
                  disabled={disabled}
                  style={{
                    color: "rgba(0,0,0,0.6)",
                  }}
                  labelPlacement="start"
                />
              </Box>
            )}
            control={control}
          />
        )}

        <Controller
          as={TextField}
          control={control}
          name="description"
          fullWidth
          multiline
          defaultValue={allDefaultValueAndKey.description?.value}
          key={allDefaultValueAndKey.description?.key}
          className={css.fieldset}
          label={d("Description").t("library_label_description")}
          disabled={disabled}
        />
        <Controller
          as={FormattedTextField}
          control={control}
          name="keywords"
          fullWidth
          decode={decodeArray}
          defaultValue={allDefaultValueAndKey.keywords?.value}
          key={allDefaultValueAndKey.keywords?.key}
          className={css.fieldset}
          label={d("Keywords").t("library_label_keywords")}
          disabled={disabled}
        />
        {lesson === "plan" && (
          <Controller
            control={control}
            name="teacher_manual_batch"
            fullWidth
            defaultValue={allDefaultValueAndKey.teacher_manual_batch?.value}
            key={allDefaultValueAndKey.teacher_manual_batch?.key}
            render={({ ref, ...props }) => (
              <MultipleUploader
                ref={ref}
                partition="teacher_manual"
                accept=".pdf,.mp3,.wav"
                {...props}
                maxAmount={5}
                maxSize={500 * FileSizeUnit.M}
                onError={(error) =>
                  Promise.reject(
                    dispatch(
                      actError(
                        error.type === MultipleUploaderErrorType.MaxAmountError
                          ? d("Failed to upload as total files number exceeds limitation 5").t("library_error_excceed_max_file_number")
                          : d("Cannot excceed max size 500 MB").t("library_error_excceed_max_size")
                      )
                    )
                  )
                }
                render={({ btnRef, value, isUploading, batch }) => (
                  <Box className={css.teacherManualBox}>
                    <div>
                      {value?.map((file) => (
                        <div key={file.id} className={css.fileItem}>
                          <Typography
                            component="div"
                            noWrap
                            variant="body1"
                            style={{
                              color: "rgba(51,51,51,1)",
                            }}
                          >
                            {file.name}{" "}
                          </Typography>
                          <CancelRounded
                            className={css.cancel}
                            onClick={() => props.onChange(props.value.filter((v: EntityTeacherManualFile) => v.id !== file.id))}
                          />
                        </div>
                      ))}
                      {isUploading &&
                        batch?.items?.map((item) => (
                          <div key={item.id} className={css.fileItem}>
                            <Typography component="div" noWrap variant="body1">
                              {item.file.name}
                            </Typography>
                            {item.completed === 100 ? (
                              ""
                            ) : item.completed === 0 ? (
                              <AccessTime className={css.iconLeft} />
                            ) : (
                              <div className={css.fileItem}>
                                <LinearProgress className={css.linearProcess} variant="determinate" value={item.completed} />
                                <Typography variant="caption" component="span" color="textSecondary">
                                  {`${Math.round(item.completed || 0)}%`}
                                </Typography>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    <div
                      style={{
                        alignItems: "center",
                        color: "rgba(0, 0, 0, 0.54)",
                        display: props.value?.length > 0 || isUploading ? "none" : "flex",
                      }}
                    >
                      {d("Teacher Manual").t("library_label_teacher_manual")}
                      <HtmlTooltip title={teacherInfo}>
                        <InfoOutlined
                          style={{
                            color: "darkgrey",
                          }}
                          className={css.iconLeft}
                        />
                      </HtmlTooltip>
                    </div>
                    <CloudUploadOutlined
                      className={css.iconField}
                      ref={btnRef as any}
                      style={{
                        display: isUploading ? "none" : "inline-block",
                      }}
                    />
                  </Box>
                )}
              />
            )}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
