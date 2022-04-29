import { Box, Card, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import { StmContext } from "./contexts";
import { pageLinks } from "./index";
import { noRepeat } from "./utils/index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  lessonunitWrap: {
    display: "flex",
    justifyContent: "flex-start",
    flexFlow: "row wrap",
    fontFamily: "RooneySans",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
    cursor: "pointer",
  },
  lessonunit: {
    width: vw(320),
    height: vw(312),
    borderRadius: vw(32),
    margin: `0 ${vw(31)} ${vw(38)} 0`,
    boxShadow: "none",
    backgroundColor: "none",
    borderColor: "none",
    fontFamily: "RooneySans",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "none",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "none",
      borderColor: "none",
    },
  },
  content: {
    padding: `${vw(12)} ${vw(23)} ${vw(25)}`,
    boxSizing: "border-box",
  },
  lessonPic: {
    height: vw(181),
    backgroundColor: "#C4C4C4",
  },
  lessonNo: {
    fontFamily: "RooneySans",
    color: "#43A1FF",
    fontWeight: 800,
    fontSize: vw(24),
    lineHeight: vw(30),
  },
  lessonDesp: {
    fontFamily: "RooneySans",
    marginTop: vw(10),
    color: "#444444",
    fontWeight: 500,
    fontSize: vw(21),
    lineHeight: vw(27),
  },
  title: {
    fontFamily: "RooneySans",
    fontWeight: "bold",
    color: "#333333",
    fontSize: vw(27),
    lineHeight: vw(34),
    marginBottom: vw(19),
  },
});

export default function LessonUnit(props: { list: ITeachingList[] }) {
  const css = useStyles();
  let history = useHistory();
  const { setRootState, ...rootState } = useContext(StmContext);
  const { unitId } = rootState;

  const handleLessonClick = (payload: LessonItem, unitId: string) => {
    setRootState && setRootState({ ...rootState, planId: payload.id, lessonId: payload.no });
    var storage = window.localStorage;
    history.push(pageLinks.present);
    let temp: LessonItem[] = [];
    const pre = localStorage.getItem("selectPlan");
    const preList: LessonItem[] = pre && JSON.parse(pre);
    if (preList && preList.length > 0) {
      preList.unshift({ ...payload, unitId });
      temp = noRepeat(preList).filter((item: LessonItem, index: number) => {
        return index < 3;
      });
    } else {
      temp.push({ ...payload, unitId });
    }
    storage.setItem("selectPlan", JSON.stringify(temp));
  };
  const handleScroll = useCallback(() => {
    const scrollEle = document.getElementById("lessonbox");
    let scrollMappingList: any[] = [];
    props.list.map((item) => {
      let targetUnitScrollHeight = document.getElementById(item.id)?.offsetTop;
      let unit = item.id;
      return scrollMappingList.push({ unit, targetUnitScrollHeight });
    });

    let scrollY: any = scrollEle && scrollEle.scrollTop;
    if (scrollY && scrollMappingList) {
      scrollMappingList.forEach((item, index) => {
        if (item.targetUnitScrollHeight < scrollY && scrollY < scrollMappingList[index + 1].targetUnitScrollHeight) {
          setRootState && setRootState({ ...rootState, currentUnit: item.unit });
        }
      });
    }
  }, [props, setRootState, rootState]);

  useEffect(() => {
    var element;
    element = unitId && document.getElementById(unitId);
    element && (element as HTMLElement).scrollIntoView();
  }, [unitId]);

  useLayoutEffect(() => {
    const scrollEle = document.getElementById("lessonbox");
    if (scrollEle) {
      scrollEle.addEventListener("scroll", handleScroll);
    }
    return () => {
      scrollEle && scrollEle.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, unitId]);

  return (
    <Box>
      {props.list.map((item: ITeachingList, index: number) => (
        <Box key={index}>
          <Typography className={css.title} id={item.id}>
            {item.id} {item.name}
          </Typography>
          <Box className={css.lessonunitWrap}>
            {item.lesson_plans.map((lessonItem: LessonItem, lessonIndex: number) => (
              <Card
                key={lessonIndex}
                className={css.lessonunit}
                onClick={() => {
                  handleLessonClick(lessonItem, item.id);
                }}
              >
                <CardMedia className={css.lessonPic} component="img" image={lessonItem.thumbnail} title="" />
                <CardContent className={css.content}>
                  <Typography className={css.lessonNo}>Lesson {lessonItem.no}</Typography>
                  <Typography className={css.lessonDesp} component="p">
                    {lessonItem.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
