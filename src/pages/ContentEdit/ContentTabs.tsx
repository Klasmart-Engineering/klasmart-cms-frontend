import { Paper, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { TabContext } from "@mui/lab";
import clsx from "clsx";
import React, { Children, ReactNode } from "react";
import { FieldError } from "react-hook-form";
import { useParams } from "react-router-dom";
import { ContentEditRouteParams } from ".";
import { d } from "../../locale/LocaleManager";

const useStyles = makeStyles(({ breakpoints, shadows, palette }) => ({
  paper: {
    position: "relative",
    zIndex: 1,
  },
  tabs: {
    backgroundColor: palette.grey[200],
    boxShadow: shadows[3],
  },
  tabPane: {
    padding: 0,
    display: "none",
    "&.active": {
      display: "block",
    },
  },
  tab: {
    fontWeight: "bold",
    padding: 0,
    [breakpoints.down("sm")]: {
      fontSize: 13,
      letterSpacing: 0,
    },
  },
  errorTab: {
    color: palette.error.main,
    // border:`1px solid ${palette.error.main}`,
    animation: `$errorFlash 1000ms ease-in-out`,
  },
  "@keyframes errorFlash": {
    "10%": { transform: "translate3d(-1px, 0, 0)" },
    "20%": { transform: "translate3d(+2px, 0, 0)" },
    "30%": { transform: "translate3d(-4px, 0, 0)" },
    "40%": { transform: "translate3d(+4px, 0, 0)" },
    "50%": { transform: "translate3d(-4px, 0, 0)" },
    "60%": { transform: "translate3d(+4px, 0, 0)" },
    "70%": { transform: "translate3d(-4px, 0, 0)" },
    "80%": { transform: "translate3d(+2px, 0, 0)" },
    "90%": { transform: "translate3d(-1px, 0, 0)" },
  },
}));

const VALUES = ["details", "outcomes", "media"];

interface ContentTabsProps {
  tab: string;
  onChangeTab: (tab: string) => any;
  children: ReactNode;
  addedLOLength?: number;
  error?: FieldError | (FieldError | undefined)[];
}
export default function ContentTabs(props: ContentTabsProps) {
  const { tab, children, onChangeTab, error, addedLOLength = 0 } = props;
  const css = useStyles();
  const { lesson } = useParams<ContentEditRouteParams>();
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down("sm"));
  let idx = -1;
  const tabPanels = Children.map(children, (child) => {
    idx += 1;
    return (
      <div key={VALUES[idx]} className={clsx(css.tabPane, { active: tab === VALUES[idx] })}>
        {child}
      </div>
    );
  });

  return (
    <Paper elevation={sm ? 0 : 3} className={css.paper}>
      <TabContext value={tab}>
        <Tabs
          value={tab}
          className={css.tabs}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, value) => onChangeTab(value)}
        >
          <Tab className={clsx(css.tab, error && css.errorTab)} label={d("Details").t("library_label_details")} value={VALUES[0]} />
          <Tab
            className={css.tab}
            label={`${d("Learning Outcomes").t("library_label_learning_outcomes")}(${addedLOLength})`}
            value={VALUES[1]}
          />
          <Tab
            className={css.tab}
            label={lesson === "material" ? d("Assets").t("library_label_assets") : d("Lesson Material").t("library_label_lesson_material")}
            value={VALUES[2]}
          />
        </Tabs>
        {tabPanels}
      </TabContext>
    </Paper>
  );
}
