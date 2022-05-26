import folderIconUrl from "@assets/icons/foldericon.svg";
import { t } from "@locale/LocaleManager";
import { createStyles, makeStyles, Tooltip, Typography } from "@material-ui/core";
import { Folder } from "@material-ui/icons";
import { useState } from "react";
import { TreeNodeProps } from ".";
const useStyles = makeStyles((theme) =>
  createStyles({
    treeItemLabel: {
      width: "calc(100% - 35px)",
      height: 36,
      fontSize: 14,
      fontWeight: "lighter",
      lineHeight: 36 / 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "initial",
      paddingLeft: 4,
      paddingRight: 4,
    },
    folderIcon: {
      marginRight: 10,
      color: "#FBCB2C",
    },
    title: {
      backgroundColor: "#f0f0f0",
      width: "100%",
      height: 36,
      lineHeight: "36px",
      textAlign: "center",
      borderRadius: "5px 5px 0 0",
    },
    closeBtn: {
      position: "absolute",
      top: theme.spacing(1),
      right: theme.spacing(1),
    },
    iconBox: {
      width: 20,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
      margin: "10px 0",
      padding: "6px 18px",
    },
    arrow: {
      "&::before": {
        boxShadow:
          "rgb(0 0 0 / 20%) 0px 0px 0px 0px,rgb(0 0 0 / 20%) 0px 0px 0px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px;",
        backgroundColor: "#fff",
        boxSizing: "border-box",
      },
    },
  })
);
const useActiveBgStyles = makeStyles({
  treeBg: ({ defaultIconPosition, isActive, paddingLeft }: ActiveBgStylesProps) => ({
    display: "flex",
    justifyContent: defaultIconPosition === "right" ? "space-between" : "",
    cursor: "pointer",
    paddingLeft,
    paddingRight: 15,
    backgroundColor: isActive ? "#ECF3FE" : "",
    "&:hover": {
      backgroundColor: "#ECF3FE",
    },
  }),
});
const ROOT_PATH = "/";
interface ActiveBgStylesProps {
  defaultIconPosition: TreeNodeProps["defaultIconPosition"];
  isActive: boolean;
  paddingLeft: number;
}

export function TreeNode(props: TreeNodeProps) {
  const { defaultPath, handleLabelClick, defaultCollapseIcon, defaultExpandIcon, defaultIconPosition, paddingLeft } = props;
  const { children, name: folderName, dir_path, id, item_count } = props.node;
  const defaultExpandIds = defaultPath.split(ROOT_PATH);
  defaultExpandIds.pop();
  const [showChildren, setShowChildren] = useState(defaultExpandIds.indexOf(id || "") > -1);
  const css = useStyles();
  const path = `${dir_path === ROOT_PATH ? "" : dir_path}/${id}`;
  const bgcss = useActiveBgStyles({ isActive: path === defaultPath, defaultIconPosition, paddingLeft });
  const name = id === "" ? t("library_label_hierarchy_root_folder") : folderName;

  const Icons = (
    <div className={css.iconBox} onClick={() => !!item_count && setShowChildren(!showChildren)}>
      {!!item_count && (showChildren ? defaultCollapseIcon : defaultExpandIcon)}
    </div>
  );
  const label = (
    <>
      {name}
      {!!item_count && <span style={{ color: "#4B88F5" }}> ({item_count <= 9 ? item_count : "9+"})</span>}
    </>
  );
  return (
    <div>
      <div className={bgcss.treeBg}>
        {defaultIconPosition === "left" && Icons}
        <div
          onClick={(e) => {
            e.preventDefault();
            handleLabelClick(path);
          }}
          className={css.treeItemLabel}
        >
          {name &&
            (showChildren ? (
              <img src={folderIconUrl} alt="" style={{ width: 25, marginRight: 10 }} />
            ) : (
              <Folder className={css.folderIcon} />
            ))}
          <Tooltip placement="top" arrow title={label} classes={{ tooltip: css.tooltip, arrow: css.arrow }}>
            <Typography component="div" noWrap>
              {label}
            </Typography>
          </Tooltip>
        </div>
        {defaultIconPosition === "right" && Icons}
      </div>
      <div>
        {showChildren &&
          children &&
          children.map((node) => <TreeNode {...props} node={node} key={node.id} paddingLeft={paddingLeft + 20} />)}
      </div>
    </div>
  );
}
