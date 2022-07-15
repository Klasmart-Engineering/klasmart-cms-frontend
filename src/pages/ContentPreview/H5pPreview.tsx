import { Box, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Palette, PaletteColor } from "@mui/material/styles";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import clsx from "clsx";
import { useState } from "react";
import { EntityContentInfoWithDetails, EntityScheduleDetailsView } from "../../api/api.auto";
import { ContentFileType, ContentType, H5pSub } from "../../api/type";
import noH5pUrl from "../../assets/icons/noh5p.svg";
import { Thumbnail } from "../../components/Thumbnail";
import { AssetPreview } from "../../components/UIAssetPreview/AssetPreview";
import { d } from "../../locale/LocaleManager";
import ContentH5p from "../ContentEdit/ContentH5p";
import { PreviewBaseProps } from "./type";

const createContainedColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: palette.common.white,
  backgroundColor: paletteColor.main,
  "&:hover": {
    backgroundColor: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ palette, breakpoints }) => ({
  btn: {
    marginLeft: "10px",
    cursor: "pointer",
  },
  whiteIconBtn: {
    color: "#000",
    backgroundColor: "#fff",
    opacity: 0.5,
    "&:hover": {
      backgroundColor: palette.primary.main,
      color: "#fff",
      opacity: 1,
    },
    "&:disabled": {
      backgroundColor: "#e0e0e0",
    },
  },
  rejectBtn: createContainedColor(palette.error, palette),
  previewContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "relative",
    height: "100%",
    minHeight: "calc(100vh - 60px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "column",
    overflowX: "hidden",
    [breakpoints.down("md")]: {
      height: "auto",
      minHeight: "520px",
      marginTop: 10,
    },
  },
  contentBtnCon: {
    width: "100%",
    minHeight: "calc(100% - 200px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    [breakpoints.down("md")]: {
      height: "auto",
      minHeight: "320px",
    },
  },
  h5pCon: {
    width: "90%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    position: "relative",
    [breakpoints.down("md")]: {
      height: "220px",
      justifyContent: "left",
      alignItems: "flex-start",
      overflowY: "scroll",
    },
  },
  innerH5pCon: {
    flex: 1,
    maxHeight: "100%",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
  },
  btnCon: {
    width: "100%",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
    [breakpoints.down("md")]: {
      marginTop: 0,
    },
  },
  viewBtn: {
    width: 204,
    height: 68,
    borderRadius: 34,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#d32f2f",
    color: "#fff",
    cursor: "pointer",
    [breakpoints.down("md")]: {
      // width: 100,
      height: 40,
      borderRadius: 10,
    },
  },
  btnFontSize: {
    fontSize: 24,
    [breakpoints.down("md")]: {
      fontSize: 12,
    },
  },
  iconBtn: {
    width: 48,
    height: 48,
    position: "absolute",
  },
  optionCon: {
    display: "flex",
    alignItems: "center",
    color: "#fff",
    flexDirection: "column",
    fontSize: 16,
  },
  iconCon: {
    width: "100%",
    position: "absolute",
    top: "45%",
    transform: "translateY(-50%)",
  },

  mapCon: {
    width: "100%",
    display: "flex",
    height: 200,
    background: "rgba(0,0,0,0.32)",
    overflowY: "hidden",
    overflowX: "scroll",
  },
  barContainer: {
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    justifyContent: "center",
  },
  mapItem: {
    flexShrink: 0,
    width: 195,
    marginLeft: 20,
    marginRight: 20,
    cursor: "pointer",
  },
  cardImg: {
    position: "absolute",
    top: 0,
    left: 0,
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "4px",
  },
  emptyImg: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "4px",
    position: "absolute",
    top: "calc(50% - 12px)",
    left: "calc(50% - 12px)",
  },
  mapText: {
    width: "100%",
    height: "42px",
    fontSize: "14px",
    color: "#ffffff",
    wordWrap: "break-word",
    wordBreak: "normal",
    overflow: "hidden",
    display: "-webkit-box",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    marginTop: 10,
  },
  active: {
    border: "4px solid #fff",
    borderRadius: "8px",
    marginTop: -15,
    position: "relative",
    marginBottom: 10,
    width: "102%",
  },
  arrow: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: "calc(50% - 3px)",
    width: 0,
    height: 0,
    borderTop: "6px solid #fff",
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
  },
  thumbnailCon: {
    width: "100%",
    paddingTop: "56.25%",
    position: "relative",
  },
  planViewBtn: {
    marginTop: -92,
  },
  planBViewBtn: {
    marginTop: -58,
  },
  emptyComponent: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  noH5p: {
    marginTop: 200,
    marginBottom: 40,
    width: 130,
    height: 133,
  },
  emptyDesc: {
    marginBottom: "auto",
    color: "#fff",
  },
  assetPreview: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mbArrowCon: {
    width: "100%",
    height: 40,
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  mbArrow: {
    height: 20,
    width: 20,
    background: "rgba(0,0,0,0.3)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.3) !important",
    },
  },
  countCon: {
    width: 40,
    height: 20,
    fontSize: "12px",
    lineHeight: "20px",
    color: "#fff",
    textAlign: "center",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "5px",
  },
}));

function EmptyContent() {
  const css = useStyles();
  return (
    <div className={css.emptyComponent}>
      <img className={css.noH5p} src={noH5pUrl} alt="deleted" />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        {d("The file has been deleted").t("library_msg_file_deleted")}
      </Typography>
    </div>
  );
}
interface IH5pPreviewProps extends PreviewBaseProps {
  h5pArray: (EntityContentInfoWithDetails | undefined)[];
  classType: EntityScheduleDetailsView["class_type"];
  content_type: EntityContentInfoWithDetails["content_type"];
}
export function H5pPreview(props: IH5pPreviewProps) {
  const css = useStyles();
  const [currIndex, setCurrIndex] = useState(0);
  const { h5pArray, onGoLive, classType, content_type } = props;
  let h5pItem = h5pArray[currIndex];
  const handlePrev = () => {
    if (currIndex > 0) {
      setCurrIndex(currIndex - 1);
      h5pItem = h5pArray[currIndex];
    }
  };
  const handleNext = () => {
    if (currIndex < h5pArray.length - 1) {
      setCurrIndex(currIndex + 1);
      h5pItem = h5pArray[currIndex];
    }
  };
  const getSuffix = (data: any) => {
    const source = data.source;
    if (
      data.file_type === ContentFileType.image ||
      data.file_type === ContentFileType.video ||
      data.file_type === ContentFileType.audio ||
      data.file_type === ContentFileType.doc ||
      data.file_type === ContentFileType.pdf
    ) {
      return source?.split(".").pop()?.toLowerCase();
    } else {
      return false;
    }
  };
  const handleClickItem = (index: number): void => {
    setCurrIndex(index);
    h5pItem = h5pArray[currIndex];
  };
  const parsedData: any = h5pItem && h5pItem.data ? JSON.parse(h5pItem.data) : {};
  const isEmpty = !h5pItem || !parsedData || h5pItem.data === "{}";
  const defaultTheme = useTheme();
  const md = useMediaQuery(defaultTheme.breakpoints.down("md"));
  return (
    <Box className={css.previewContainer}>
      <Box className={css.contentBtnCon}>
        <div className={css.h5pCon}>
          {isEmpty ? (
            <EmptyContent />
          ) : !getSuffix(parsedData) ? (
            <ContentH5p sub={H5pSub.view} value={parsedData.source} />
          ) : (
            <AssetPreview resourceId={parsedData} isHideFileType={true} className={css.assetPreview} />
          )}
          {h5pArray.length > 1 && !md && (
            <Box className={css.iconCon}>
              <IconButton
                disabled={currIndex === 0}
                className={clsx(css.iconBtn, css.whiteIconBtn)}
                style={{ left: -32 }}
                onClick={handlePrev}
              >
                <ArrowBackIosOutlinedIcon />
              </IconButton>
              <IconButton
                disabled={currIndex >= h5pArray.length - 1}
                className={clsx(css.iconBtn, css.whiteIconBtn)}
                style={{ right: -32 }}
                onClick={handleNext}
              >
                <ArrowForwardIosOutlinedIcon />
              </IconButton>
            </Box>
          )}
        </div>
        {h5pArray.length > 1 && md && (
          <div className={css.mbArrowCon}>
            <IconButton
              classes={{ root: css.mbArrow }}
              // disabled={currIndex === 0}
              className={css.mbArrow}
              style={{ left: -32 }}
              onClick={handlePrev}
            >
              <ArrowBackIosOutlinedIcon style={{ color: "#fff", fontSize: 12 }} />
            </IconButton>
            <div className={css.countCon}>
              {currIndex + 1}/{h5pArray.length}
            </div>
            <IconButton
              // disabled={currIndex >= h5pArray.length - 1}
              className={css.mbArrow}
              style={{ right: -32 }}
              onClick={handleNext}
            >
              <ArrowForwardIosOutlinedIcon style={{ color: "#fff", fontSize: 12 }} />
            </IconButton>
          </div>
        )}
        <Box className={css.btnCon}>
          <Box className={clsx(css.viewBtn)} onClick={onGoLive}>
            {d("View in").t("library_label_view_in") !== "-" && d("View in").t("library_label_view_in")}{" "}
            {classType === "OnlineClass" && d("Live Class").t("library_label_kidsloop_live")}
            {classType === "OfflineClass" && d("KidsLoop Class").t("schedule_preview_class")}
            {classType === "Homework" && d("KidsLoop Study").t("schedule_preview_study")}
            {classType === "Task" && d("Live Class").t("library_label_kidsloop_live")}
            {/* {d("View in").t("library_label_view_in") !== "-" && (
              <Box style={{ fontSize: 18 }}>{d("View in").t("library_label_view_in")}</Box>
            )}
            {classType === "OnlineClass" && (
              <Typography className={css.btnFontSize}>{d("Live Class").t("library_label_kidsloop_live")}</Typography>
            )}
            {classType === "OfflineClass" && (
              <Typography className={css.btnFontSize}>{d("KidsLoop Class").t("schedule_preview_class")}</Typography>
            )}
            {classType === "Homework" && (
              <Typography className={css.btnFontSize}>{d("KidsLoop Study").t("schedule_preview_study")}</Typography>
            )}
            {classType === "Task" && (
              <Typography className={css.btnFontSize}>{d("Live Class").t("library_label_kidsloop_live")}</Typography>
            )} */}
          </Box>
        </Box>
      </Box>
      {h5pArray.length && content_type === ContentType.plan && (
        <div className={css.mapCon}>
          <div className={css.barContainer}>
            {h5pArray.map((material, index) => (
              <div key={index} className={css.mapItem}>
                <div onClick={() => handleClickItem(index)} className={clsx(css.thumbnailCon, { [css.active]: currIndex === index })}>
                  {material ? (
                    <Thumbnail
                      className={css.cardImg}
                      type={ContentType.material}
                      id={material.thumbnail}
                      onClick={() => handleClickItem(index)}
                    ></Thumbnail>
                  ) : (
                    <img className={css.emptyImg} src={noH5pUrl} alt="deleted" />
                  )}
                  {currIndex === index && <div className={css.arrow}></div>}
                </div>
                {material ? (
                  <Typography className={css.mapText}>
                    {material.name} ({material.suggest_time} min)
                  </Typography>
                ) : (
                  <Typography className={css.mapText}>{d("The file has been deleted").t("library_msg_file_deleted")}</Typography>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}
