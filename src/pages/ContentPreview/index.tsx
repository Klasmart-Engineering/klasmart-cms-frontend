// import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { apiLivePath } from "@api/extra";
import PermissionType from "@api/PermissionType";
import { ContentType } from "@api/type";
import { usePermission } from "@hooks/usePermission";
import useQueryCms from "@hooks/useQueryCms";
import { t } from "@locale/LocaleManager";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import {
  approveContent,
  deleteContent,
  getLiveToken,
  getScheduleLiveLessonPlan,
  lockContent,
  onLoadContentPreview,
  publishContent,
  rejectContent,
} from "@reducers/content";
import { RootState } from "@reducers/index";
import { actError, actSuccess } from "@reducers/notify";
import { AsyncTrunkReturned } from "@reducers/type";
import { PayloadAction } from "@reduxjs/toolkit";
import { throttle } from "lodash";
import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ModelLessonPlan, Segment } from "../../models/ModelLessonPlan";
import LayoutPair from "../ContentEdit/Layout";
import { ContentPreviewHeader } from "./ContentPreviewHeader";
import { Detail } from "./Detail";
import { H5pPreview } from "./H5pPreview";
import { LearningOutcome } from "./LeaningOutcomes";
import { OperationBtn } from "./OperationBtn";
import { TabValue } from "./type";

interface RouteParams {
  tab: "details" | "outcomes";
}

export default function ContentPreview(props: EntityContentInfoWithDetails) {
  const dispatch = useDispatch();
  const { routeBasePath } = ContentPreview;
  const { id, search, sid, author, program_group } = useQueryCms();
  const { contentPreview } = useSelector<RootState, RootState["content"]>((state) => state.content);
  const { scheduleDetial } = useSelector<RootState, RootState["schedule"]>((state) => state.schedule);
  const { tab } = useParams<RouteParams>();
  const content_type = contentPreview.content_type;
  const history = useHistory();
  const perm = usePermission([PermissionType.attend_live_class_as_a_teacher_186]);
  const defaultTheme = useTheme();
  const md = useMediaQuery(defaultTheme.breakpoints.down("md"));
  const handleDelete = async () => {
    await dispatch(deleteContent({ id, type: "delete" }));
    history.go(-1);
  };
  const handlePublish = async () => {
    await dispatch(publishContent(id));
    history.go(-1);
  };
  const handleApprove = async () => {
    await dispatch(approveContent(id));
    history.go(-1);
  };
  const handleReject = async () => {
    const { payload } = (await dispatch(rejectContent({ id: id }))) as unknown as PayloadAction<AsyncTrunkReturned<typeof rejectContent>>;
    if (payload === "ok") {
      dispatch(actSuccess("Reject success"));
      history.go(-1);
    }
  };
  const handleEdit = async () => {
    const lesson =
      contentPreview.content_type === ContentType.material
        ? "material"
        : contentPreview.content_type === ContentType.plan
        ? "plan"
        : "material";
    const rightSide =
      contentPreview.content_type === ContentType.material
        ? "contentH5p"
        : contentPreview.content_type === ContentType.plan
        ? "planComposeGraphic"
        : "contentH5p";
    if (contentPreview.publish_status === "published") {
      const { payload } = (await dispatch(lockContent(id))) as unknown as PayloadAction<AsyncTrunkReturned<typeof lockContent>>;
      if (payload.id) {
        history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${payload.id}`);
      }
    } else {
      history.push(`/library/content-edit/lesson/${lesson}/tab/details/rightside/${rightSide}?id=${id}`);
    }
  };
  const handleClose = () => {
    history.go(-1);
  };
  const handleChangeTab = useMemo(
    () => (value: string) => {
      history.replace(`${routeBasePath}/tab/${value}${search}`);
    },
    [history, routeBasePath, search]
  );

  const handleGoLive = async () => {
    if (!perm.attend_live_class_as_a_teacher_186) {
      dispatch(actError(t("general_error_no_permission")));
    } else {
      if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 0) {
        let winOpen = window.open("", "_blanck");
        const { payload } = (await dispatch(
          getLiveToken({ metaLoading: true, content_id: id, schedule_id: sid })
        )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getLiveToken>>;
        payload ? winOpen && (winOpen.location = apiLivePath(payload)) : winOpen?.close();
      } else {
        const { payload } = (await dispatch(
          getLiveToken({ metaLoading: true, content_id: id, schedule_id: sid })
        )) as unknown as PayloadAction<AsyncTrunkReturned<typeof getLiveToken>>;
        payload && window.open(apiLivePath(payload));
      }
    }
  };
  const leftside = (
    <Box style={{ padding: 12, overflowX: "hidden" }}>
      <ContentPreviewHeader
        tab={tab}
        contentPreview={contentPreview}
        content_type={content_type}
        onClose={handleClose}
        onChangeTab={handleChangeTab}
        md={md}
        permission={contentPreview.permission}
        author={author}
        isMine={contentPreview.is_mine}
        publish_status={contentPreview.publish_status}
        onDelete={handleDelete}
        onPublish={handlePublish}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={handleEdit}
      />
      {tab === TabValue.details ? (
        <Detail contentPreview={contentPreview} />
      ) : (
        <LearningOutcome list={contentPreview.outcome_entities || []} />
      )}
      {!sid && tab === TabValue.details && !program_group && !md && (
        <OperationBtn
          permission={contentPreview.permission}
          author={author}
          isMine={contentPreview.is_mine}
          publish_status={contentPreview.publish_status}
          content_type={contentPreview.content_type}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
        />
      )}
    </Box>
  );
  const planRes = (): (EntityContentInfoWithDetails | undefined)[] => {
    if (contentPreview.content_type === ContentType.plan) {
      const segment: Segment = JSON.parse(contentPreview.data || "{}");
      const h5pArray = ModelLessonPlan.toArray(segment);
      return h5pArray;
    } else {
      return [contentPreview];
    }
  };
  const rightside = (
    <Fragment>
      {contentPreview.id && (
        <H5pPreview
          content_type={contentPreview.content_type}
          classType={scheduleDetial.class_type}
          h5pArray={planRes()}
          onGoLive={throttle(handleGoLive, 2000, { trailing: false })}
        ></H5pPreview>
      )}
    </Fragment>
  );
  useEffect(() => {
    if (sid) {
      dispatch(getScheduleLiveLessonPlan(sid));
    } else {
      dispatch(onLoadContentPreview({ metaLoading: true, content_id: id }));
    }
  }, [dispatch, id, sid]);
  return (
    <Fragment>
      <LayoutPair
        breakpoint="md"
        leftWidth={434}
        rightWidth={1400}
        spacing={0}
        basePadding={0}
        padding={0}
        onContextMenu={(e) => {
          e.preventDefault();
          return false;
        }}
      >
        {leftside}
        {rightside}
      </LayoutPair>
    </Fragment>
  );
}
ContentPreview.routeBasePath = "/library/content-preview";
ContentPreview.routeMatchPath = "/library/content-preview/tab/:tab";
ContentPreview.routeRedirectDefault = `/library/content-preview/tab/details`;
