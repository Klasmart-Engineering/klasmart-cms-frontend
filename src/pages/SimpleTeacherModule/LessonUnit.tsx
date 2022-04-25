import { Box, Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { pageLinks } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  lessonunitWrap: {
    display: "flex",
    justifyContent: "flex-start",
    flexFlow: "row wrap",
  },
  lessonunit: {
    width: vw(320),
    height: vw(312),
    backgroundColor: "#FFFFFF",
    borderRadius: vw(32),
    margin: `0 ${vw(31)} ${vw(20)} 0`,
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
    color: "#43A1FF",
    fontWeight: 700,
    fontSize: vw(24),
    lineHeight: vw(30),
  },
  lessonDesp: {
    marginTop: vw(10),
    color: "#444444",
    fontWeight: 500,
    fontSize: vw(21),
    lineHeight: vw(27),
  },
});

export default function LessonUnit(props: { list: IPlanList[] }) {
  const css = useStyles();
  let history = useHistory();
  const handleLessonClick = (payload: IPlanList) => {
    var storage = window.localStorage;
    history.push(pageLinks.present);
    let temp = [];
    const pre = localStorage.getItem("selectPlan");
    const preList = pre && JSON.parse(pre);
    if (preList) {
      temp = preList.concat(payload).reverse();
    } else {
      temp.push(payload);
    }
    storage.setItem("selectPlan", JSON.stringify(temp));
  };
  return (
    <Box className={css.lessonunitWrap}>
      {props.list.map((item: IPlanList, index: number) => (
        <Card
          key={index}
          className={css.lessonunit}
          onClick={() => {
            handleLessonClick(item);
          }}
        >
          <CardActionArea>
            <CardMedia className={css.lessonPic} component="img" image={item.thumbnail} title="" />
            <CardContent className={css.content}>
              <Typography className={css.lessonNo}>Lesson {item.no}</Typography>
              <Typography className={css.lessonDesp} component="p">
                {item.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
