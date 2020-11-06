import { Grid } from "@material-ui/core";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import KidsCalendar from "../../components/Calendar";
import LayoutBox from "../../components/LayoutBox";
import { useRepeatSchedule } from "../../hooks/useRepeatSchedule";
import { AsyncTrunkReturned, contentLists } from "../../reducers/content";
import {
  getScheduleInfo,
  getScheduleTimeViewData,
  getMockOptions,
  getScheduleLiveToken,
  getScheduleMockOptions,
  getScheduleParticipant,
} from "../../reducers/schedule";
import { AlertDialogProps, modeViewType, RouteParams, timestampType } from "../../types/scheduleTypes";
import ScheduleEdit from "./ScheduleEdit";
import ScheduleTool from "./ScheduleTool";
import SearchList from "./SearchList";
import { ModelMockOptions } from "../../models/ModelMockOptions";
import { RootState } from "../../reducers";
import { PayloadAction } from "@reduxjs/toolkit";
import { apiLivePath } from "../../api/extra";
import ConfilctTestTemplate from "./ConfilctTestTemplate";
import { d } from "../../locale/LocaleManager";
import ModalBox from "../../components/ModalBox";

const useQuery = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const scheduleId = query.get("schedule_id") || "";
  const teacherName = query.get("teacher_name") || "";
  return { scheduleId, teacherName };
};

const parseRightside = (rightside: RouteParams["rightside"]) => ({
  includeTable: rightside.includes("scheduleTable"),
  includeList: rightside.includes("scheduleList"),
});

const parseModel = (model: RouteParams["model"]) => ({
  includeEdit: model.includes("edit"),
  includePreview: model.includes("preview"),
});

function ScheduleContent() {
  const { model, rightside } = useParams();
  const { includeTable, includeList } = parseRightside(rightside);
  const { includePreview } = parseModel(model);
  const timestampInt = (timestamp: number) => Math.floor(timestamp);
  const { mockOptions, scheduleMockOptions, participantMockOptions } = useSelector<RootState, RootState["schedule"]>(
    (state) => state.schedule
  );
  const dispatch = useDispatch();
  const { scheduleId } = useQuery();
  const [state] = useRepeatSchedule();
  const { type } = state;
  const [changeProgram, setChangeProgram] = React.useState<string>("");
  const flattenedMockOptions = ModelMockOptions.toFlatten({ programId: changeProgram, developmentalId: "" }, mockOptions);

  const handleChangeProgramId = (programId: string) => {
    setChangeProgram(programId);
  };

  const initModalDate: AlertDialogProps = {
    handleChange: function (p1: number) {},
    radioValue: 0,
    radios: undefined,
    title: "",
    text: "",
    enableCustomization: false,
    customizeTemplate: <ConfilctTestTemplate handleDelete={() => {}} handleClose={() => {}} title={d("Edit").t("assess_button_edit")} />,
    openStatus: false,
    buttons: [],
    handleClose: () => {
      changeModalDate({ openStatus: false });
    },
  };

  const [modalDate, setModalDate] = React.useState<AlertDialogProps>(initModalDate);

  const changeModalDate = useCallback(
    (data: object) => {
      setModalDate({ ...modalDate, ...data });
    },
    [modalDate]
  );

  /**
   * calendar model view change
   */
  const [modelView, setModelView] = React.useState<modeViewType>("month");
  const changeModelView = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModelView(event.target.value as modeViewType);
  };

  /**
   * get participants
   * @param class_id
   */
  const getParticipantOptions = (class_id: string) => {
    dispatch(getScheduleParticipant({ class_id: class_id }));
  };

  /**
   * calendar model view change
   */
  const [timesTamp, setTimesTamp] = React.useState<timestampType>({
    start: timestampInt(new Date().getTime() / 1000),
    end: timestampInt(new Date().getTime() / 1000),
  });
  const changeTimesTamp = (times: timestampType) => {
    setTimesTamp(times);
  };

  const toLive = async (schedule_id: string) => {
    let tokenInfo: any;
    tokenInfo = ((await dispatch(getScheduleLiveToken({ schedule_id, metaLoading: true }))) as unknown) as PayloadAction<
      AsyncTrunkReturned<typeof getScheduleLiveToken>
    >;
    if (tokenInfo) window.open(apiLivePath(tokenInfo.payload.token));
  };

  React.useEffect(() => {
    dispatch(
      getScheduleTimeViewData({
        view_type: modelView,
        time_at: timesTamp.start,
        time_zone_offset: -new Date().getTimezoneOffset() * 60,
      })
    );
  }, [modelView, timesTamp, dispatch]);

  React.useEffect(() => {
    dispatch(getMockOptions());
    dispatch(getScheduleMockOptions({ organization_id: "3f135b91-a616-4c80-914a-e4463104dbac" }));
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(contentLists({ publish_status: "published", content_type: "2" }));
    if (scheduleId) dispatch(getScheduleInfo(scheduleId));
    setModalDate({
      handleChange: function (p1: number) {},
      radioValue: 0,
      radios: undefined,
      title: "",
      text: "",
      enableCustomization: false,
      customizeTemplate: <></>,
      openStatus: false,
      buttons: [],
      handleClose: () => {},
    });
  }, [scheduleId, setModalDate, dispatch]);

  return (
    <>
      <LayoutBox holderMin={40} holderBase={80} mainBase={1920}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ScheduleTool
              includeList={includeList}
              changeModelView={changeModelView}
              modelView={modelView}
              changeTimesTamp={changeTimesTamp}
              timesTamp={timesTamp}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <ScheduleEdit
              includePreview={includePreview}
              timesTamp={timesTamp}
              changeTimesTamp={changeTimesTamp}
              repeatData={{ type, [type]: state[type] }}
              modelView={modelView}
              scheduleId={scheduleId}
              includeTable={includeTable}
              flattenedMockOptions={flattenedMockOptions}
              handleChangeProgramId={handleChangeProgramId}
              toLive={toLive}
              changeModalDate={changeModalDate}
              mockOptions={mockOptions.options}
              scheduleMockOptions={scheduleMockOptions}
              participantMockOptions={participantMockOptions}
              getParticipantOptions={getParticipantOptions}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            {includeTable && (
              <KidsCalendar
                modelView={modelView}
                timesTamp={timesTamp}
                changeTimesTamp={changeTimesTamp}
                toLive={toLive}
                changeModalDate={changeModalDate}
              />
            )}
            {includeList && <SearchList />}
          </Grid>
        </Grid>
      </LayoutBox>
      <ModalBox modalDate={modalDate} />
    </>
  );
}

export default function Schedule() {
  return <ScheduleContent />;
}

Schedule.routeBasePath = "/schedule/calendar";
Schedule.routeMatchPath = "/schedule/calendar/rightside/:rightside/model/:model";
Schedule.routeRedirectDefault = "/schedule/calendar/rightside/scheduleTable/model/preview";
