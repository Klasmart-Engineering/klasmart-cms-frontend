import { Box, makeStyles, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import comingsoonIconUrl from "../../assets/icons/coming soon.svg";
import emptyIconUrl from "../../assets/icons/empty.svg";
import noFilesIconUrl from "../../assets/icons/nofiles.svg";
import noPermissionUrl from "../../assets/icons/permission.jpg";
import { t } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints }) => ({
  emptyImage: {
    marginTop: 200,
    marginBottom: 40,
  },
  emptyDesc: {
    marginBottom: "auto",
  },
  emptyContainer: {
    textAlign: "center",
  },
}));

export enum TipImagesType {
  empty = "empty",
  commingSoon = "commingSoon",
  noResults = "noResults",
  noPermission = "noPermission",
}
export type TextLabel = "library_msg_no_results_found" | "library_label_empty" | "library_msg_coming_soon" | "library_error_no_permissions";
interface TipImagesProps {
  type: TipImagesType;
  text: TextLabel;
}
export function TipImages(props: TipImagesProps) {
  const { type, text } = props;
  const css = useStyles();
  let src = "";
  if (type === TipImagesType.empty) {
    src = emptyIconUrl;
  }
  if (type === TipImagesType.commingSoon) {
    src = comingsoonIconUrl;
  }
  if (type === TipImagesType.noResults) {
    src = noFilesIconUrl;
  }
  if (type === TipImagesType.noPermission) {
    src = noPermissionUrl;
  }
  return (
    <Fragment>
      <Box className={css.emptyContainer}>
        <img className={css.emptyImage} alt={type} src={src} />
        <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
          {t(text)}
        </Typography>
      </Box>
    </Fragment>
  );
}