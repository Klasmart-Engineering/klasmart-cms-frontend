import DateFnsUtils from "@date-io/date-fns";
import { Box, Button, MenuItem, TextField, ThemeProvider } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Close, DeleteOutlineOutlined, FileCopyOutlined, Save } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DatePicker, KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { EntityScheduleAddView, EntityScheduleShortInfo } from "../../api/api.auto";
import { MockOptionsItem } from "../../api/extra";
import { initialState, useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { d, reportMiss, t } from "../../locale/LocaleManager";
import { FlattenedMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import { AsyncTrunkReturned } from "../../reducers/content";
import { actError, actSuccess } from "../../reducers/notify";
import {
  getScheduleTimeViewData,
  initScheduleDetial,
  removeSchedule,
  resetScheduleDetial,
  saveScheduleData,
} from "../../reducers/schedule";
import theme from "../../theme";
import { modeViewType, repeatOptionsType, timestampType } from "../../types/scheduleTypes";
import ContentPreview from "../ContentPreview";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import RepeatSchedule from "./Repeat";
import ScheduleAttachment from "./ScheduleAttachment";

const useStyles = makeStyles(({ shadows }) => ({
  fieldset: {
    marginTop: 20,
    width: "100%",
  },
  halfFieldset: {
    marginTop: 20,
    width: "calc(50% - 10px)",
    "&:not(:first-child)": {
      marginLeft: 20,
    },
  },
  formControset: {
    padding: "10px 10px 20px 10px",
    boxShadow: shadows[3],
    position: "relative",
  },
  toolset: {
    fontSize: "20px",
    cursor: "pointer",
  },
  fieldBox: {
    position: "relative",
  },
  iconField: {
    position: "absolute",
    right: "10px",
    top: "48%",
  },
  descFiled: {
    height: "100px",
  },
  repeatBox: {
    position: "absolute",
    top: "0",
    left: "101%",
    boxShadow: shadows[3],
    zIndex: 999,
  },
}));

function SmallCalendar(props: CalendarStateProps) {
  const { timesTamp, changeTimesTamp } = props;
  const getTimestamp = (date: any | null) => new Date(date).getTime() / 1000;
  const handleDateChange = (date: Date | null) => {
    changeTimesTamp({ start: getTimestamp(date), end: getTimestamp(date) });
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <DatePicker autoOk variant="static" openTo="date" value={new Date(timesTamp.start * 1000)} onChange={handleDateChange} />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

function EditBox(props: CalendarStateProps) {
  const css = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const defaults: EntityScheduleShortInfo = { id: "", name: "" };

  const {
    timesTamp,
    modelView,
    scheduleId,
    includeTable,
    changeTimesTamp,
    flattenedMockOptions,
    handleChangeProgramId,
    toLive,
    changeModalDate,
  } = props;

  const { scheduleDetial } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { contentsList } = useSelector<RootState, RootState["content"]>((state) => state.content);

  const [selectedDueDate, setSelectedDate] = React.useState<Date | null>(new Date(new Date().setHours(new Date().getHours())));
  const [classItem, setClassItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [lessonPlan, setLessonPlan] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [subjectItem, setSubjectItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [programItem, setProgramItem] = React.useState<EntityScheduleShortInfo | undefined>(defaults);
  const [teacherItem, setTeacherItem] = React.useState<any[] | undefined>([]);
  const [contentsListSelect, setContentsListSelect] = React.useState<EntityScheduleShortInfo[]>([defaults]);
  const [attachmentId, setAttachmentId] = React.useState<string>("");
  const [attachmentName, setAttachmentName] = React.useState<string>("");
  const [isRepeatSame, setIsRepeatSame] = React.useState(true);

  const timestampInt = (timestamp: number) => Math.floor(timestamp);

  React.useEffect(() => {
    if (scheduleId) {
      setAttachmentName(scheduleDetial?.attachment?.name as string);
      setAttachmentId(scheduleDetial?.attachment?.id as string);
    } else {
      setAttachmentName("");
      setAttachmentId("");
    }
  }, [scheduleDetial, scheduleDetial.attachment, scheduleId]);

  React.useEffect(() => {
    const newContentsData: EntityScheduleShortInfo[] = [];
    if (contentsList.length > 0) {
      contentsList.forEach((item: EntityScheduleShortInfo) => {
        newContentsData.push({ id: item.id, name: item.name });
      });
    }
    setContentsListSelect(newContentsData);
  }, [contentsList]);

  React.useEffect(() => {
    const defaults: EntityScheduleShortInfo = { id: "", name: "" };
    const timesTampDada = {
      start_at: timesTamp.start,
      end_at: timesTamp.end,
    };
    setStatus({
      allDayCheck: false,
      repeatCheck: false,
      dueDateCheck: false,
    });
    const newData: any = {
      attachment_path: "",
      class_id: "",
      class_type: "",
      description: "",
      due_at: Math.floor(new Date().getTime() / 1000),
      is_all_day: false,
      is_force: true,
      is_repeat: false,
      lesson_plan_id: "",
      program_id: "",
      repeat: {},
      subject_id: "",
      teacher_ids: [],
      title: "",
      ...timesTampDada,
    };
    setClassItem(defaults);
    setLessonPlan(defaults);
    setSubjectItem(defaults);
    setProgramItem(defaults);
    setTeacherItem([]);
    setScheduleList(newData);
    setInitScheduleList(newData);
    dispatch(resetScheduleDetial(initScheduleDetial));
  }, [dispatch, timesTamp]);

  const formatTeahcerId = (teacherIds: any) => {
    let ids: string[] = [];
    teacherIds.forEach((val: EntityScheduleShortInfo | any) => {
      ids.push(val.id.toString());
    });
    return ids;
  };

  React.useEffect(() => {
    if (scheduleId && scheduleDetial.id) {
      const newData: EntityScheduleAddView = {
        attachment: scheduleDetial.attachment,
        class_id: scheduleDetial.class!.id || "",
        class_type: scheduleDetial.class_type,
        description: scheduleDetial.description,
        due_at: scheduleDetial.due_at,
        end_at: scheduleDetial.end_at || 0,
        is_all_day: scheduleDetial.is_all_day,
        is_force: true,
        is_repeat: true,
        lesson_plan_id: scheduleDetial.lesson_plan!.id || "",
        program_id: scheduleDetial.program!.id || "",
        repeat: {},
        start_at: scheduleDetial.start_at || 0,
        subject_id: scheduleDetial.subject!.id || "",
        teacher_ids: formatTeahcerId(scheduleDetial.teachers),
        title: scheduleDetial.title || "",
      };
      setStatus({
        allDayCheck: newData.is_all_day ? true : false,
        repeatCheck: false,
        dueDateCheck: newData.due_at ? true : false,
      });
      setClassItem(scheduleDetial.class);
      setLessonPlan(scheduleDetial.lesson_plan);
      setSubjectItem(scheduleDetial.subject);
      setProgramItem(scheduleDetial.program);
      setTeacherItem(scheduleDetial.teachers);
      setScheduleList(newData);
      setInitScheduleList(newData);
    }
  }, [scheduleDetial, scheduleId]);

  const [state, dispatchRepeat] = useRepeatSchedule();
  const { type } = state;
  const repeatData = {
    type,
    [type]: state[type],
  };

  React.useEffect(() => {
    if (scheduleId && scheduleDetial.repeat) {
      // @ts-ignore
      const isSame = JSON.stringify(state[type]) === JSON.stringify(scheduleDetial.repeat[type]);
      setIsRepeatSame(isSame);
    }
  }, [scheduleDetial.repeat, scheduleId, state, type]);

  React.useEffect(() => {
    if (scheduleDetial?.repeat?.type) {
      const data = scheduleDetial.repeat;
      dispatchRepeat({ type: "changeData", data });
    }
  }, [dispatchRepeat, scheduleDetial]);

  const currentTime = timestampInt(new Date().getTime() / 1000);

  const initData: EntityScheduleAddView = {
    attachment: {},
    class_id: "",
    class_type: "OnlineClass",
    description: "",
    due_at: currentTime,
    end_at: currentTime,
    is_all_day: false,
    is_force: true,
    is_repeat: false,
    lesson_plan_id: "",
    org_id: "",
    program_id: "",
    repeat: {},
    start_at: currentTime,
    subject_id: "",
    teacher_ids: [],
    time_zone_offset: 0,
    title: "",
    version: 0,
  };

  const [scheduleList, setScheduleList] = React.useState<EntityScheduleAddView>(initData);

  const [initScheduleList, setInitScheduleList] = React.useState<EntityScheduleAddView>(initData);

  const timeToTimestamp = (time: string) => {
    const currentTime = time.replace(/-/g, "/").replace(/T/g, " ");
    return timestampInt(new Date(currentTime).getTime() / 1000);
  };

  const timestampToTime = (timestamp: number | undefined, type: string = "default") => {
    const date = new Date(Number(timestamp) * 1000);
    const dateNumFun = (num: number) => (num < 10 ? `0${num}` : num);
    const [Y, M, D, h, m] = [
      date.getFullYear(),
      dateNumFun(date.getMonth() + 1),
      dateNumFun(date.getDate()),
      dateNumFun(date.getHours()),
      dateNumFun(date.getMinutes()),
      dateNumFun(date.getSeconds()),
    ];
    if (type === "all_day_start") {
      return timestampInt(new Date(Y, date.getMonth(), date.getDate(), 0, 0, 0).getTime() / 1000);
    } else if (type === "all_day_end") {
      return timestampInt(new Date(Y, date.getMonth(), date.getDate(), 23, 59, 59).getTime() / 1000);
    } else {
      return `${Y}-${M}-${D}T${h}:${m}`;
    }
  };

  /**
   * autocomplete input change
   * @param value
   * @param name
   */
  const autocompleteChange = (value: any | null, name: string) => {
    let ids: any[] = [];
    if (name === "teacher_ids") {
      value.forEach((val: any, key: number) => {
        ids.push(val.id.toString());
      });
      setTeacherItem(value);
    } else {
      ids = value ? value["id"] : "";
    }
    if (name === "class_id") {
      setClassItem(value);
    }
    if (name === "lesson_plan_id") {
      setLessonPlan(value);
    }
    if (name === "subject_id") {
      setSubjectItem(value);
    }
    if (name === "program_id") {
      handleChangeProgramId(value.id);
      setSubjectItem(defaults);
      setProgramItem(value);
    }
    setScheduleData(name, ids);
  };

  /**
   * Normal input box change
   * @param event
   * @param name
   */
  const handleTopicListChange = (event: React.ChangeEvent<{ value: String | Number }>, name: string) => {
    const value = name === "start_at" || name === "end_at" ? timeToTimestamp(event.target.value as string) : (event.target.value as string);
    const currentTime = Math.floor(new Date().getTime() / 1000);
    if (name === "start_at" && value < currentTime) {
      dispatch(actError(d("Start time cannot be earlier than current time").t("schedule_msg_start_current")));
      return;
    }
    if (name === "title" && (event.target.value as string).length > 20) return;
    if (name === "description" && (event.target.value as string).length > 100) return;
    setScheduleData(name, value);
  };

  const setScheduleData = (name: string, value: string | number | object | null) => {
    const newTopocList = {
      ...scheduleList,
      [name]: value as string | number | object | null,
    };
    setScheduleList((newTopocList as unknown) as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
  };

  /**
   * form input validator
   */
  const isValidator = {
    title: false,
    class_id: false,
    lesson_plan_id: false,
    teacher_ids: false,
    start_at: false,
    end_at: false,
    subject_id: false,
    program_id: false,
    class_type: false,
  };
  const [validator, setValidator] = React.useState(isValidator);

  const validatorFun = () => {
    let verificaPath = true;
    for (let name in scheduleList) {
      if (isValidator.hasOwnProperty(name)) {
        // @ts-ignore
        const result = scheduleList[name].toString().length > 0;
        // @ts-ignore
        isValidator[name] = !result;
        if (!result) {
          verificaPath = false;
        }
      }
    }
    isValidator.lesson_plan_id = isValidator.program_id = isValidator.subject_id = scheduleList.class_type !== "Task";
    setValidator({ ...isValidator });
    return verificaPath;
  };

  /**
   * save schedule data
   */
  const saveSchedule = async (repeat_edit_options: repeatOptionsType = "only_current", is_force: boolean = true) => {
    if (!validatorFun()) return;
    changeModalDate({ OpenStatus: false });
    const addData: any = {};
    addData["due_at"] = 0;
    if (checkedStatus.dueDateCheck) {
      // @ts-ignore
      const dueDateTimestamp = timestampInt(selectedDueDate.getTime() / 1000);
      if (dueDateTimestamp <= scheduleList.end_at) {
        dispatch(actError(d("The due date cannot be earlier than the scheduled class end time.").t("schedule_msg_due_date_earlier")));
        return;
      }
      addData["due_at"] = dueDateTimestamp;
    }
    if (scheduleList.end_at <= scheduleList.start_at) {
      dispatch(actError(d("End time cannot be earlier than start time").t("schedule_msg_end_time_earlier")));
      return;
    }
    addData["is_all_day"] = checkedStatus.allDayCheck;
    addData["is_repeat"] = checkedStatus.repeatCheck;
    addData["repeat"] = checkedStatus.repeatCheck ? repeatData : {};
    addData["attachment"] = { id: attachmentId, name: attachmentName };
    if (scheduleId) {
      addData["repeat_edit_options"] = repeat_edit_options;
    }
    addData["time_zone_offset"] = -new Date().getTimezoneOffset() * 60;
    addData["is_force"] = is_force;
    let resultInfo: any;
    resultInfo = ((await dispatch(saveScheduleData({ ...scheduleList, ...addData, metaLoading: true }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof saveScheduleData>
    >;
    if (resultInfo.payload) {
      dispatch(
        getScheduleTimeViewData({
          view_type: modelView,
          time_at: timesTamp.start,
          time_zone_offset: -new Date().getTimezoneOffset() * 60,
        })
      );
      dispatch(actSuccess(d("Save Successfully.").t("assess_msg_save_successfully")));
      dispatchRepeat({ type: "changeData", data: initialState });
      history.push(`/schedule/calendar/rightside/${includeTable ? "scheduleTable" : "scheduleList"}/model/preview`);
    } else if (resultInfo.error.message === "schedule_msg_overlap") {
      changeModalDate({
        openStatus: true,
        enableCustomization: false,
        text: d("You already have a class scheduled during this time. Confirm to schedule?").t("schedule_msg_overlap"),
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({ openStatus: false });
            },
          },
          {
            label: d("CONFIRM").t("schedule_button_confirm"),
            event: () => {
              saveSchedule("with_following", false);
            },
          },
        ],
      });
    }
  };

  const isScheduleExpired = (): boolean => {
    return scheduleId ? scheduleDetial.status !== "NotStart" : false;
  };

  const saveTheTest = () => {
    if (scheduleId && scheduleDetial.is_repeat && checkedStatus.repeatCheck) {
      if (isRepeatSame) {
        changeModalDate({
          openStatus: true,
          enableCustomization: true,
          customizeTemplate: (
            <ConfilctTestTemplate
              handleDelete={saveSchedule}
              handleClose={() => {
                changeModalDate({ openStatus: false });
              }}
              title={d("Edit").t("assess_button_edit")}
            />
          ),
        });
      } else {
        changeModalDate({
          openStatus: true,
          enableCustomization: false,
          text: d("This is an event in a series. Are you sure you want to edit this and following events?").t(
            "schedule_schedule_msg_edit_all"
          ),
          buttons: [
            {
              label: d("CANCEL").t("schedule_button_cancel"),
              event: () => {
                changeModalDate({ openStatus: false });
              },
            },
            {
              label: d("CONFIRM").t("schedule_button_confirm"),
              event: () => {
                saveSchedule("with_following");
              },
            },
          ],
        });
      }
    } else {
      saveSchedule(checkedStatus.repeatCheck ? "with_following" : "only_current");
    }
  };

  const [checkedStatus, setStatus] = React.useState({
    allDayCheck: false,
    repeatCheck: false,
    dueDateCheck: false,
  });

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "allDayCheck" && event.target.checked) {
      const newTopocList = {
        ...scheduleList,
        start_at: timestampToTime(scheduleList.start_at, "all_day_start"),
        end_at: timestampToTime(scheduleList.end_at, "all_day_end"),
      };
      setScheduleList((newTopocList as unknown) as { [key in keyof EntityScheduleAddView]: EntityScheduleAddView[key] });
    }
    setStatus({ ...checkedStatus, [event.target.name]: event.target.checked });
  };

  const handleDueDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const deleteScheduleByid = async (repeat_edit_options: repeatOptionsType = "only_current") => {
    await dispatch(
      removeSchedule({ schedule_id: scheduleDetial.id as string, repeat_edit_options: { repeat_edit_options: repeat_edit_options } })
    );
    dispatch(
      getScheduleTimeViewData({
        view_type: modelView,
        time_at: timesTamp.start,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
      })
    );
    dispatch(actSuccess(d("Delete sucessfully").t("schedule_msg_delete_success")));
    /*    changeTimesTamp({
      start: Math.floor(new Date().getTime() / 1000),
      end: Math.floor(new Date().getTime() / 1000),
    });*/
    changeModalDate({ openStatus: false });
    history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
  };

  /**
   * modal type delete
   */
  const handleDelete = () => {
    if (scheduleDetial.is_repeat) {
      changeModalDate({
        openStatus: true,
        enableCustomization: true,
        customizeTemplate: (
          <ConfilctTestTemplate
            handleDelete={deleteScheduleByid}
            handleClose={() => {
              changeModalDate({ openStatus: false });
            }}
            title={d("Delete").t("assess_label_delete")}
          />
        ),
      });
    } else {
      changeModalDate({
        openStatus: true,
        enableCustomization: false,
        text: d("Are you sure you want to delete this event?").t("schedule_msg_delete"),
        buttons: [
          {
            label: d("CANCEL").t("schedule_button_cancel"),
            event: () => {
              changeModalDate({ openStatus: false });
            },
          },
          {
            label: d("Delete").t("assess_label_delete"),
            event: () => {
              deleteScheduleByid();
            },
          },
        ],
      });
    }
  };

  /**
   * modal type confirm close
   */
  const closeEdit = () => {
    changeModalDate({ enableCustomization: false });
    const scheduleListOld = JSON.stringify(initScheduleList);
    const scheduleListNew = JSON.stringify(scheduleList);
    if (scheduleListNew === scheduleListOld && !checkedStatus.allDayCheck && !checkedStatus.repeatCheck && !checkedStatus.dueDateCheck) {
      changeTimesTamp({ start: currentTime, end: currentTime });
      history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
      return;
    }
    changeModalDate({
      openStatus: true,
      enableCustomization: false,
      text: d("Discard unsave changes?").t("schedule_msg_discard"),
      buttons: [
        {
          label: d("CANCEL").t("schedule_button_cancel"),
          event: () => {
            changeModalDate({ openStatus: false });
          },
        },
        {
          label: d("DISCARD").t("schedule_button_discard"),
          event: () => {
            changeModalDate({ openStatus: false });
            history.push("/schedule/calendar/rightside/scheduleTable/model/preview");
          },
        },
      ],
    });
  };

  const handleRepeatData = (data: any) => {
    dispatchRepeat({ type: "changeData", data });
  };
  type classTypeLabel =
    | "schedule_detail_online_class"
    | "schedule_detail_offline_class"
    | "schedule_detail_homework"
    | "schedule_detail_task";
  const menuItemListClassType = (list: MockOptionsItem[]) =>
    list.map((item) => (
      <MenuItem key={item.id} value={item.id}>
        {t(item.name as classTypeLabel)}
      </MenuItem>
    ));

  return (
    <ThemeProvider theme={theme}>
      <Box className={css.formControset}>
        <Box>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={6}>
              <Close
                style={{
                  color: "#666666",
                }}
                className={css.toolset}
                onClick={closeEdit}
              />
            </Grid>
            {!isScheduleExpired() && (
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <DeleteOutlineOutlined
                  style={{
                    color: "#D74040",
                    visibility: scheduleId ? "visible" : "hidden",
                  }}
                  className={css.toolset}
                  onClick={handleDelete}
                />
                <Save
                  style={{
                    color: "#0E78D5",
                    marginLeft: "10px",
                  }}
                  className={css.toolset}
                  onClick={saveTheTest}
                />
              </Grid>
            )}
          </Grid>
        </Box>
        <Box className={css.fieldBox}>
          <TextField
            error={validator.title}
            className={css.fieldset}
            label={d("Lesson Name").t("schedule_detail_lesson_name")}
            value={scheduleList.title}
            onChange={(e) => handleTopicListChange(e, "title")}
            required
            disabled={isScheduleExpired()}
          ></TextField>
          <FileCopyOutlined className={css.iconField} />
        </Box>
        <Autocomplete
          id="combo-box-demo"
          options={flattenedMockOptions.classes}
          getOptionLabel={(option: any) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "class_id");
          }}
          value={classItem}
          disabled={isScheduleExpired()}
          renderInput={(params) => (
            <TextField
              {...params}
              error={validator.class_id}
              className={css.fieldset}
              label={d("Add Class").t("schedule_detail_add_class")}
              required
              variant="outlined"
            />
          )}
        />
        {scheduleList.class_type !== "Task" && (
          <Autocomplete
            id="combo-box-demo"
            freeSolo
            options={contentsListSelect}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, newValue) => {
              autocompleteChange(newValue, "lesson_plan_id");
            }}
            value={lessonPlan}
            disabled={isScheduleExpired()}
            renderInput={(params) => (
              <TextField
                {...params}
                className={css.fieldset}
                label={d("Lesson Plan").t("library_label_lesson_plan")}
                error={validator.lesson_plan_id}
                value={scheduleList.lesson_plan_id}
                variant="outlined"
                required={scheduleList.class_type !== "Task"}
              />
            )}
          />
        )}
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          multiple
          options={flattenedMockOptions.teachers}
          getOptionLabel={(option: any) => option.name}
          onChange={(e: any, newValue) => {
            autocompleteChange(newValue, "teacher_ids");
          }}
          value={teacherItem}
          disabled={isScheduleExpired()}
          renderInput={(params) => (
            <TextField
              {...params}
              className={css.fieldset}
              label={reportMiss("Add Participants", "schedule_detail_participants")}
              error={validator.teacher_ids}
              value={scheduleList.teacher_ids}
              variant="outlined"
              required
            />
          )}
        />
        <Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={12}>
                <TextField
                  id="datetime-local"
                  label={d("Start Time").t("schedule_detail_start_time")}
                  type="datetime-local"
                  className={css.fieldset}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  error={validator.start_at}
                  value={timestampToTime(scheduleList.start_at)}
                  disabled={isScheduleExpired() || checkedStatus.allDayCheck}
                  onChange={(e) => handleTopicListChange(e, "start_at")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="datetime-local"
                  label={d("End Time").t("schedule_detail_end_time")}
                  type="datetime-local"
                  className={css.fieldset}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  error={validator.end_at}
                  value={timestampToTime(scheduleList.end_at)}
                  disabled={isScheduleExpired() || checkedStatus.allDayCheck}
                  onChange={(e) => handleTopicListChange(e, "end_at")}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <Box>
          <FormGroup row>
            <FormControlLabel
              disabled={isScheduleExpired()}
              control={<Checkbox name="allDayCheck" color="primary" checked={checkedStatus.allDayCheck} onChange={handleCheck} />}
              label={d("All day").t("schedule_detail_all_day")}
            />
            <FormControlLabel
              disabled={isScheduleExpired()}
              control={<Checkbox name="repeatCheck" color="primary" checked={checkedStatus.repeatCheck} onChange={handleCheck} />}
              label={d("Repeat").t("schedule_detail_repeat")}
            />
          </FormGroup>
        </Box>
        {scheduleList.class_type !== "Task" && (
          <Autocomplete
            id="combo-box-demo"
            options={flattenedMockOptions.program}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, newValue) => {
              autocompleteChange(newValue, "program_id");
            }}
            value={programItem}
            disabled={isScheduleExpired()}
            renderInput={(params) => (
              <TextField
                {...params}
                className={css.fieldset}
                label={d("Program").t("assess_label_program")}
                variant="outlined"
                error={validator.program_id}
                value={scheduleList.program_id}
                required
              />
            )}
          />
        )}
        {scheduleList.class_type !== "Task" && (
          <Autocomplete
            id="combo-box-demo"
            options={flattenedMockOptions.subject}
            getOptionLabel={(option: any) => option.name}
            onChange={(e: any, newValue) => {
              autocompleteChange(newValue, "subject_id");
            }}
            value={subjectItem}
            disabled={isScheduleExpired()}
            renderInput={(params) => (
              <TextField
                {...params}
                className={css.fieldset}
                label={d("Subject").t("assess_label_subject")}
                error={validator.subject_id}
                variant="outlined"
                value={scheduleList.subject_id}
                disabled={isScheduleExpired()}
                required
              />
            )}
          />
        )}
        <TextField
          className={css.fieldset}
          label={d("Class Type").t("schedule_detail_class_type")}
          value={scheduleList.class_type}
          onChange={(e) => handleTopicListChange(e, "class_type")}
          error={validator.class_type}
          select
          required
          disabled={isScheduleExpired()}
        >
          {menuItemListClassType(flattenedMockOptions.class_types)}
        </TextField>
        <Box style={{ display: scheduleList?.class_type === "Task" || scheduleList?.class_type === "Homework" ? "block" : "none" }}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs={4}>
                <FormControlLabel
                  disabled={isScheduleExpired()}
                  control={<Checkbox name="dueDateCheck" color="primary" checked={checkedStatus.dueDateCheck} onChange={handleCheck} />}
                  label={d("Due Date").t("schedule_detail_due_date")}
                />
              </Grid>
              <Grid item xs={6}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label={d("Pick Time").t("schedule_detail_pick_time")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  value={selectedDueDate}
                  disabled={isScheduleExpired()}
                  onChange={handleDueDateChange}
                />
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        </Box>
        <TextField
          id="outlined-multiline-static"
          className={css.fieldset}
          label={d("Description").t("assess_label_description")}
          multiline
          rows={4}
          variant="outlined"
          value={scheduleList.description}
          disabled={isScheduleExpired()}
          onChange={(e) => handleTopicListChange(e, "description")}
        />
        <ScheduleAttachment
          setAttachmentId={setAttachmentId}
          attachmentId={attachmentId}
          attachmentName={attachmentName}
          setAttachmentName={setAttachmentName}
        />
        <Box className={css.fieldset} style={{ display: scheduleId ? "block" : "none" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "45%", marginRight: "10%" }}
            disabled={scheduleList.class_type === "Task"}
            href={`/#${ContentPreview.routeRedirectDefault}?id=${scheduleList.lesson_plan_id}&sid=${scheduleId}`}
          >
            {d("Preview").t("schedule_button_preview")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: "45%" }}
            onClick={() => {
              toLive(scheduleId as string);
            }}
          >
            {d("Go Live").t("schedule_button_go_live")}
          </Button>
        </Box>
        {checkedStatus.repeatCheck && (
          <Box className={css.repeatBox}>
            <RepeatSchedule handleRepeatData={handleRepeatData} repeatState={state} />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
}

interface CalendarStateProps {
  timesTamp: timestampType;
  changeTimesTamp: (value: timestampType) => void;
  repeatData: object;
  modelView: modeViewType;
  scheduleId?: string;
  includeTable?: boolean;
  flattenedMockOptions: FlattenedMockOptions;
  handleChangeProgramId: (value: string) => void;
  toLive: (schedule_id: string) => void;
  changeModalDate: (data: object) => void;
}

interface ScheduleEditProps extends CalendarStateProps {
  includePreview: boolean;
}

export default function ScheduleEdit(props: ScheduleEditProps) {
  const {
    includePreview,
    timesTamp,
    changeTimesTamp,
    repeatData,
    modelView,
    scheduleId,
    includeTable,
    flattenedMockOptions,
    handleChangeProgramId,
    toLive,
    changeModalDate,
  } = props;
  const template = (
    <Box>
      <Box
        style={{
          display: includePreview ? "block" : "none",
        }}
      >
        <SmallCalendar
          changeTimesTamp={changeTimesTamp}
          timesTamp={timesTamp}
          repeatData={repeatData}
          modelView={modelView}
          flattenedMockOptions={flattenedMockOptions}
          handleChangeProgramId={handleChangeProgramId}
          toLive={toLive}
          changeModalDate={changeModalDate}
        />
      </Box>
      <Box
        style={{
          display: includePreview ? "none" : "block",
        }}
      >
        <EditBox
          changeTimesTamp={changeTimesTamp}
          timesTamp={timesTamp}
          repeatData={repeatData}
          modelView={modelView}
          scheduleId={scheduleId}
          includeTable={includeTable}
          flattenedMockOptions={flattenedMockOptions}
          handleChangeProgramId={handleChangeProgramId}
          toLive={toLive}
          changeModalDate={changeModalDate}
        />
      </Box>
    </Box>
  );
  return template;
}
