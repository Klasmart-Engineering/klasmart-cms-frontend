import { Box, Card, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { pageLinks, StmContext } from "./index";
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
});

export default function LessonUnit(props: { list: ITeachingList[] }) {
  const css = useStyles();
  let history = useHistory();
  const { setRootState, ...rootState } = useContext(StmContext);
  const handleLessonClick = (payload: ITeachingList) => {
    setRootState && setRootState({ ...rootState, planId: payload.id, lessonId: payload.no });
    var storage = window.localStorage;
    history.push(pageLinks.present);
    let temp: ITeachingList[] = [];
    const pre = localStorage.getItem("selectPlan");
    const preList = pre && JSON.parse(pre);
    if (preList && preList.length > 0) {
      preList.unshift(payload);
      temp = noRepeat(preList).filter((item, index) => {
        return index < 3;
      });
    } else {
      temp.push(payload);
    }
    storage.setItem("selectPlan", JSON.stringify(temp));
  };
  return (
    <Box className={css.lessonunitWrap}>
      {props.list.map((item: ITeachingList, index: number) => (
        <Card
          key={index}
          className={css.lessonunit}
          onClick={() => {
            handleLessonClick(item);
          }}
        >
          <CardMedia className={css.lessonPic} component="img" image={item.thumbnail} title="" />
          <CardContent className={css.content}>
            <Typography className={css.lessonNo}>Lesson {item.no}</Typography>
            <Typography className={css.lessonDesp} component="p">
              {item.name}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
