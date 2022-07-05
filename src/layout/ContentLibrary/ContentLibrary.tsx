/* eslint-disable react/prop-types */
import { t } from "@locale/LocaleManager";
import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { Link, useLocation } from "react-router-dom";
import Tabs, { Tab } from "./tabs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      padding: theme.spacing(0, 2),
      position: "sticky",
      top: 0,
      zIndex: 11,
    },
  })
);

type ContentLibraryPage = `Badanamu Content` | `Organization Content` | `More Featured Content`;

interface ContentTab {
  id: ContentLibraryPage;
  programGroup: string;
  path: string;
}

interface ContentLibraryLayoutProps {}

const ContentLibraryLayout: React.VFC<ContentLibraryLayoutProps> = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const basePath = `/library`;
  const getTranslationIdByPageId = (id: ContentLibraryPage) => {
    switch (id) {
      case `Badanamu Content`:
        return t(`navbar_BadanamuContentTab`);
      case `More Featured Content`:
        return t(`navbar_MoreFeaturedContentTab`);
      case `Organization Content`:
        return t(`navbar_OrganizationContentTab`);
    }
  };

  const tabs: Tab[] = (
    [
      {
        id: `Organization Content`,
        programGroup: "",
        path: `${basePath}/my-content-list?publish_status=published&page=1`,
      },
      {
        id: `Badanamu Content`,
        programGroup: "BadaESL",
        path: `${basePath}/my-content-list?program_group=BadaESL&order_by=-update_at&page=1`,
      },
      {
        id: `More Featured Content`,
        programGroup: "More Featured Content",
        path: `${basePath}/my-content-list?program_group=More Featured Content&order_by=-update_at&page=1`,
      },
    ] as ContentTab[]
  ).map((tab) => ({
    text: getTranslationIdByPageId(tab.id),
    value: tab.programGroup,
    url: tab.path,
  }));

  if (location.pathname.endsWith(basePath)) return <Link replace to={tabs[0].value ?? ``} />;

  if (location.pathname.startsWith(basePath)) {
    return <Tabs className={classes.tabs} tabs={tabs} value={tabs.find((v) => v.value === search.get("program_group"))?.value} />;
  }
  return <></>;
};

export default ContentLibraryLayout;