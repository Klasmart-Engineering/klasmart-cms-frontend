import { Button, makeStyles, TextField, TextFieldProps } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import clsx from "clsx";
import React, { ChangeEvent, useMemo, useState } from "react";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import { d } from "../../locale/LocaleManager";
import { SearchListForm, UserEntity } from "./types";

const SEARCHINPUT="SEARCH_NAME"

const useStyles = makeStyles((theme) => ({
  searchText: {
    position: "relative",
    backgroundColor: "#fff",
    zIndex: 200,
    width: "280px",
    borderRadius: "4px",
    // "& .MuiOutlinedInput-notchedOutline": {
    //   border: 0,
    //   borderRadius: 0,
    // },
  },
  exectSearchInput: {
    maxWidth: 128,
    marignRgiht: -10,
    height: 40,
    boxSizing: "border-box",
    background: "#F0F0F0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: 0,
    },
  },
  searchWrap: {
    display: "inline-flex",
    position: "relative",
  },
  searchCon: {
    display: "inline-flex",
    // border: "1px solid rgba(0,0,0,0.23)",
    borderRadius: 4,
    boxSizing: "border-box",
    verticalAlign: "top",
  },
  searchBtn: {
    position: "relative",
    zIndex: 200,
    width: "120px",
    height: "40px",
    backgroundColor: "#0E78D5",
    marginLeft: "20px",
  },
  teacherListCon: {
    width: 280,
    maxHeight: 200,
    boxShadow: "0px 5px 5px -3px rgba(0,0,0,0.20), 0px 3px 14px 2px rgba(0,0,0,0.12), 0px 8px 10px 1px rgba(0,0,0,0.14)",
    borderRadius: "4px",
    boxSizing: "border-box",
    paddingTop: 5,
    background: "#fff",
    position: "absolute",
    top: "calc(100% + 10px)",
    zIndex: 200,
    overflow: "auto",
    wrap: "nowrap",
  },
  teacherItemCon: {
    lineHeight: "40px",
    cursor: "pointer",
    paddingLeft: 10,
    "&:hover": {
      color: "#0E78D5",
    },
  },
  nullCon: {
    lineHeight: "40px",
    paddingLeft: 10,
  },
  bigZindex: {
    zIndex: 1400,
  },
  mask: {
    position: "fixed",
    zIndex: 100,
    inset: 0,
    width: "100%",
    height: "100%",
    opacity: 1,
    transition: "opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));

export interface Options {
  label?: string;
  value?: string;
}

export interface SearchComProps {
  searchFieldList?: Options[];
  searchFieldDefaultValue?: string;
  searchTextDefaultValue?: string;
  defaultTeacherName?: string;
  formMethods?: UseFormMethods<SearchListForm>;
  usersList?: UserEntity[];
  onSearch: (searchField: string, searchInfo: UserEntity) => void;
  onSearchTeacherName: (searchText: string) => void;
}

export function ListSearch(props: SearchComProps) {
  const css = useStyles();
  const { searchFieldDefaultValue, searchTextDefaultValue, defaultTeacherName, usersList, onSearch, onSearchTeacherName } = props;
  const formMethods = useForm();
  const { control, getValues, setValue } = formMethods;
  const [teacher, setTeacher] = useState<UserEntity>({ id: "", name: "" });
  const [isFocus, setIsfocus] = useState(false);
  const [selectAction, setSelectAction] = useState(false);
  const [showMask, setShowMask] = useState(false);
  const teacherNameValues = getValues()[SEARCHINPUT];
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const showList = isFocus && teacherNameValues && usersList;
  const disableSearchBtn = useMemo(() => {
    if (!teacher.id && !teacherNameValues) {
      return false;
    }
    if(teacherNameValues) {
      if(usersList?.length) {
        if(selectAction) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }, [selectAction, teacher.id, usersList?.length, teacherNameValues])
  const handleClickSearch = () => {
    if(!teacherNameValues) {
      onSearch(searchFieldDefaultValue!, {id: "", name: ""})
    } else {
      if(teacherNameValues === teacher.name) {
        onSearch(searchFieldDefaultValue!, teacher);
      } else {
        onSearch(searchFieldDefaultValue!, {id: searchTextDefaultValue!, name: teacherNameValues})
      }
    }
    setSelectAction(false);
    setShowMask(false);
    setIsfocus(false);
  };
  const handleKeyPress: TextFieldProps["onKeyPress"] = (event) => {
    if (event.key === "Enter") {
      if (disableSearchBtn) {
        return;
      }
      if(!teacherNameValues) {
        onSearch(searchFieldDefaultValue!, {id: "", name: ""})
      } else {
        onSearch(searchFieldDefaultValue!, teacher);
      }
      setSelectAction(false);
      setShowMask(false);
    }
  };
  // const handleKeyUp: TextFieldProps["onKeyUp"] = () => {
  //   const searchText = getValues()["teacherName"];
  //   onSearchTeacherName(searchText);
  //   setIsfocus(true);
  //   setSelectAction(false);
  // }
  
  const handleSelectTeacher = (teacher: UserEntity)  => {
    setValue(SEARCHINPUT, teacher.name)
    setTeacher(teacher);
    setIsfocus(false);
    setSelectAction(true);
  };

  const handleOnFocus = () => {
    setShowMask(true);
    setIsfocus(true);
    if(searchTextDefaultValue) {
      setValue(SEARCHINPUT, "")
      onSearchTeacherName("");
    }
  };

  const handleHideMask = () => {
    setShowMask(false);
    setIsfocus(false);
    setValue(SEARCHINPUT, defaultTeacherName)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (timer) clearTimeout(timer);
    const curTimer = setTimeout(() => {
      onSearchTeacherName(event.target.value);
      setIsfocus(true);
      setSelectAction(false);
    }, 500);
    setTimer(curTimer);
  };

  return (
    <div className={clsx(css.searchWrap, isFocus ? css.bigZindex : "")}>
      {showMask && <MaskCom onHideMask={handleHideMask} />}
      <div style={{ position: "relative" }}>
        <div className={css.searchCon}>
          {/* <Controller
          as={TextField}
          control={control}
          name={SearchListFormKey.EXECT_SEARCH}
          className={css.exectSearchInput}
          size="small"
          defaultValue={searchFieldDefaultValue}
          select
          SelectProps={{
            MenuProps: {
              transformOrigin: {
                vertical: -40,
                horizontal: "left",
              },
            },
          }}
        >
          {menuItemList(searchFieldList)}
        </Controller> */}
        <Controller
          style={{
            borderLeft: 0,
          }}
          as={TextField}
          name={SEARCHINPUT}
          control={control}
          size="small"
          onFocusCapture={handleOnFocus}
          className={css.searchText}
          onKeyPress={handleKeyPress}
          // onKeyUp={debounce(handleKeyUp, 500)}
          onChangeCapture={handleChange}
          defaultValue={defaultTeacherName}
          placeholder={d("Search teacher").t("schedule_text_search_teacher")}
        />
      </div>
      <Button variant="contained" color="primary" disabled={disableSearchBtn} className={css.searchBtn} onClick={handleClickSearch}>
        <Search /> {d("Search").t("assess_label_search")}
      </Button>
      {
        showList &&
          <div className={css.teacherListCon}>
            {usersList?.length ? usersList?.map(item => 
              <div className={css.teacherItemCon} key={item.id} onClick={e => handleSelectTeacher(item)}>
                {item.name}
              </div>
            ) : <div className={css.nullCon}>{d("No Matching Result").t("assessment_search_no_matching_result")}</div>} 
          </div>
        }
      </div>
    </div>
  );
}

export interface MaskComProps {
  open?: boolean;
  onClose?: () => void;
  onHideMask: () => void;
}
export function MaskCom(props: MaskComProps) {
  const css = useStyles();
  const { onHideMask } = props;
  const handleClick = () => {
    onHideMask();
  };
  return <div className={css.mask} onClick={handleClick}></div>;
}
