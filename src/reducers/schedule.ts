import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../api";
import { EntityScheduleAddView, EntityScheduleDetailsView } from "../api/api.auto";
import { LoadingMetaPayload } from "./middleware/loadingMiddleware";

export interface ScheduleState {
  scheduleDetial: EntityScheduleDetailsView;
  errorLable: string;
}

interface Rootstate {
  schedule: ScheduleState;
}

export const initScheduleDetial: EntityScheduleDetailsView = {
  id: "",
  title: "",
  class: {},
  lesson_plan: {},
  start_at: 0,
  end_at: 0,
  repeat: {},
  subjects: [],
  program: {},
  class_type: "OnlineClass",
  class_type_label: {},
  due_at: 0,
  description: "",
  attachment: {},
  is_all_day: true,
  is_repeat: false,
  real_time_status: {},
  outcome_ids: [],
};

const initialState: ScheduleState = {
  scheduleDetial: initScheduleDetial,
  errorLable: "",
};

type SaveStatusResourseParams = {
  payload: EntityScheduleAddView;
  is_new_schedule: boolean;
};
export const saveScheduleData = createAsyncThunk<
  EntityScheduleAddView,
  SaveStatusResourseParams & LoadingMetaPayload,
  { state: Rootstate }
>(
  "schedule/save",
  // @ts-ignore
  async ({ payload, is_new_schedule }, { getState }) => {
    let {
      schedule: {
        scheduleDetial: { id },
      },
    } = getState();
    if (!id || is_new_schedule) {
      const result = await api.schedules.addSchedule(payload).catch((err) => Promise.reject(err.label));
      // @ts-ignore
      if (!result.data?.id) return result;
      // @ts-ignore
      id = result.data?.id;
    } else {
      // @ts-ignore
      const result = await api.schedules.updateSchedule(id, payload).catch((err) => Promise.reject(err.label));
      // @ts-ignore
      if (!result.data?.id) return result;
      // @ts-ignore
      id = result.data?.id;
    }
    // @ts-ignore
    return await api.schedules.getScheduleById(id).catch((err) => Promise.reject(err.label));
  }
);

export const saveScheduleDataReview = createAsyncThunk<
  EntityScheduleAddView,
  SaveStatusResourseParams & LoadingMetaPayload,
  { state: Rootstate }
>(
  "scheduleReview/save",
  // @ts-ignore
  async ({ payload, is_new_schedule }, { getState }) => {
    return await api.schedules.addSchedule(payload).catch((err) => Promise.reject(err.label));
  }
);

type deleteSchedulesParams = {
  schedule_id: Parameters<typeof api.schedules.deleteSchedule>[0];
  repeat_edit_options: Parameters<typeof api.schedules.deleteSchedule>[1];
};
type deleteSchedulesResult = ReturnType<typeof api.schedules.deleteSchedule>;
export const removeSchedule = createAsyncThunk<deleteSchedulesResult, deleteSchedulesParams>(
  "schedule/delete",
  ({ schedule_id, repeat_edit_options }, query) => {
    return api.schedules.deleteSchedule(schedule_id, repeat_edit_options);
  }
);

type infoSchedulesParams = Parameters<typeof api.schedules.getScheduleById>[0];
type infoSchedulesResult = ReturnType<typeof api.schedules.getScheduleById>;
export const getScheduleInfo = createAsyncThunk<infoSchedulesResult, infoSchedulesParams>("schedule/info", (schedule_id, query) => {
  return api.schedules.getScheduleById(schedule_id);
});

const { actions, reducer } = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    resetScheduleDetial: (state, { payload }: PayloadAction<ScheduleState["scheduleDetial"]>) => {
      state.scheduleDetial = payload;
    },
  },
  extraReducers: {
    [saveScheduleData.fulfilled.type]: (state, { payload }: any) => {
      if (payload.label !== "schedule_msg_users_conflict") state.scheduleDetial = payload;
    },
    [saveScheduleData.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [removeSchedule.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = initScheduleDetial;
    },
    [removeSchedule.rejected.type]: (state, { error }: any) => {
      state.errorLable = error.message;
    },
    [getScheduleInfo.fulfilled.type]: (state, { payload }: any) => {
      state.scheduleDetial = payload;
    },
  },
});
export const { resetScheduleDetial } = actions;
export default reducer;
