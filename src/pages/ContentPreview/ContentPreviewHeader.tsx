import { Box, Chip, Tab, Tabs, Theme, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CloseIcon from "@mui/icons-material/Close";
import React, { Fragment } from "react";
import { EntityContentInfoWithDetails } from "../../api/api.auto";
import { ContentType } from "../../api/type";
import { Thumbnail } from "../../components/Thumbnail";
import { d } from "../../locale/LocaleManager";
import { ActionProps, OperationBtnMb } from "./OperationBtn";
import { TabValue } from "./type";

const useStyles = makeStyles((theme: Theme) => ({
  closeIconCon: {
    // textAlign: "right",
    display: "flex",
    justifyContent: "flex-end",
  },
  text: {
    fontSize: "24px",
    fontWeight: 700,
    marginRight: "10px",
    wordBreak: "break-word",
    [theme.breakpoints.down("lg")]: {
      fontSize: "20px",
    },
  },
  nameCon: {
    display: "flex",
    alignItems: "center",
    marginTop: 30,
  },
  imgCon: {
    width: "100%",
    paddingTop: "56.25%",
    margin: "10px 0 20px 0",
    textAlign: "center",
    position: "relative",
  },
  img: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  tab: {
    width: "calc(100% + 24px)",
    backgroundColor: "#f0f0f0",
    marginLeft: "-12px",
    fontSize: "18px",
  },
}));

interface ContentPreviewProps extends ActionProps {
  tab: string;
  contentPreview: EntityContentInfoWithDetails;
  content_type: EntityContentInfoWithDetails["content_type"];
  md: boolean;
  onClose: () => any;
  onChangeTab: (value: TabValue) => any;
}
export function ContentPreviewHeader(props: ContentPreviewProps) {
  const css = useStyles();
  const {
    tab,
    contentPreview,
    onClose,
    onChangeTab,
    md,
    permission,
    author,
    publish_status,
    content_type,
    onDelete,
    onPublish,
    onApprove,
    onReject,
    onEdit,
  } = props;
  return (
    <Fragment>
      <Box className={css.closeIconCon}>
        {md && (
          <OperationBtnMb
            permission={permission}
            author={author}
            isMine={contentPreview.is_mine}
            publish_status={publish_status}
            content_type={contentPreview.content_type}
            onDelete={onDelete}
            onPublish={onPublish}
            onApprove={onApprove}
            onReject={onReject}
            onEdit={onEdit}
          />
        )}
        <CloseIcon style={{ cursor: "pointer", marginTop: "3px" }} onClick={onClose} />
      </Box>
      <Box className={css.nameCon}>
        <Typography className={css.text}>{contentPreview.name}</Typography>
        <Chip
          size="small"
          color="primary"
          style={{ color: "#fff", backgroundColor: contentPreview.content_type === ContentType.material ? "#3f51b5" : "#4caf50" }}
          label={
            contentPreview.content_type === ContentType.material
              ? d("Lesson Material").t("library_label_lesson_material")
              : d(`Lesson Plan`).t("library_label_lesson_plan")
          }
        />
      </Box>
      <Box className={css.imgCon}>
        <Thumbnail className={css.img} type={content_type} id={contentPreview?.thumbnail} key={contentPreview?.thumbnail} />
      </Box>
      <Tabs
        className={css.tab}
        value={tab}
        onChange={(e, value) => onChangeTab(value)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label={d("Details").t("library_label_details")} value={TabValue.details} />
        <Tab label={d("Learning Outcomes").t("library_label_learning_outcomes")} value={TabValue.leaningoutcomes} />
      </Tabs>
    </Fragment>
  );
}
