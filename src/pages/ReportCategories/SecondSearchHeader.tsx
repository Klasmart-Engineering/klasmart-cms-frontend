import { Divider, Hidden, Menu, MenuItem, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Item } from "@reducers/report";
import clsx from "clsx";
import React, { forwardRef } from "react";
import LayoutBox from "../../components/LayoutBox";
import { d } from "../../locale/LocaleManager";
import { ICacheData } from "../../services/permissionCahceService";
import { QueryCondition } from "../ReportAchievementList/types";

const useStyles = makeStyles(({ palette, shadows, breakpoints }) => ({
  box: {
    [breakpoints.down(1500)]: {
      height: 100,
    },
  },
  boxRight: {
    position: "absolute",
    right: 0,
    [breakpoints.down(1500)]: {
      top: 60,
      left: 0,
    },
    [breakpoints.up(1500)]: {
      top: 0,
    },
  },
  selectButton: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
    marginRight: 20,
  },
  lastButton: {
    marginRight: 0,
  },
  selectIcon: {
    marginRight: 20,
  },
  selectIconDisabled: {
    color: palette.grey[500],
  },
  divider: {
    marginTop: 20,
  },
}));

export interface SecondSearchHeaderProps {
  value: QueryCondition;
  onChange: (value: string, tab: keyof QueryCondition) => any;
  teacherList: Item[];
  perm: ICacheData;
}

interface GetTeacherItemProps {
  list: SecondSearchHeaderProps["teacherList"];
  value: QueryCondition;
  onChangeMenu: (e: React.MouseEvent, value: string, tab: keyof QueryCondition) => any;
  tab: keyof QueryCondition;
}

const GetTeacherItem = forwardRef<React.RefObject<HTMLElement>, GetTeacherItemProps>((props, ref) => {
  const { list, value, onChangeMenu, tab } = props;
  return (
    <>
      {" "}
      {list &&
        list.map((item) => (
          <MenuItem key={item.id} selected={value[tab] === item.id} onClick={(e) => onChangeMenu(e, item.id as string, tab)}>
            {item.name}
          </MenuItem>
        ))}
    </>
  );
});

export function SecondSearchHeader(props: SecondSearchHeaderProps) {
  const { onChange, value, teacherList, perm } = props;
  const css = useStyles();
  const [anchorElTeacher, setAnchorElTeacher] = React.useState<null | HTMLElement>(null);
  const showItem = (event: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(event.currentTarget);
  };
  const handleClose = (e: any, tab: keyof QueryCondition) => {
    if (tab === "teacher_id") setAnchorElTeacher(null);
  };
  const handleChangeMenu = (e: React.MouseEvent, value: any, tab: keyof QueryCondition) => {
    handleClose(e, tab);
    onChange(value, tab);
  };
  return (
    <LayoutBox holderMin={40} holderBase={202} mainBase={1517}>
      {(perm.report_organizations_skills_taught_640 || perm.report_schools_skills_taught_641) && teacherList.length > 0 && (
        <>
          <Hidden smDown>
            <TextField
              size="small"
              className={css.selectButton}
              onChange={(e) => onChange(e.target.value, "teacher_id")}
              label={d("Teacher").t("report_label_teacher")}
              value={value.teacher_id || teacherList[0]?.id || ""}
              select
              disabled={teacherList.length < 2}
            >
              {teacherList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </TextField>
          </Hidden>
          <Hidden mdUp>
            <PersonOutlinedIcon
              fontSize="large"
              className={clsx(css.selectIcon, teacherList.length <= 0 && css.selectIconDisabled)}
              onClick={(e) => showItem(e, "teacher_id")}
            />
            <Menu anchorEl={anchorElTeacher} keepMounted open={Boolean(anchorElTeacher)} onClose={(e) => handleClose(e, "teacher_id")}>
              <GetTeacherItem list={teacherList} value={value} onChangeMenu={handleChangeMenu} tab="teacher_id"></GetTeacherItem>
            </Menu>
          </Hidden>
        </>
      )}
      <Divider className={css.divider} />
    </LayoutBox>
  );
}
