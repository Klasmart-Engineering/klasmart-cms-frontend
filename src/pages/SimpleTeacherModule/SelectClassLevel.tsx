import { Box, Button, makeStyles, Typography, withStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { pageLinks } from ".";
import Header from "./components/Header";
import { StmContext } from "./index";
import vw from "./utils/vw.macro";

const data: ILessonData[] = [
  {
    img: require("@assets/stm/bada-rhyme.png").default,
    level: "1",
    age: "Age 4-5",
    color: "#c572ff",
  },
  {
    img: require("@assets/stm/bada-genius.png").default,
    level: "2",
    age: "Age 5-6",
    color: "#fbc319",
  },
  {
    img: require("@assets/stm/bada-talk.png").default,
    level: "3",
    age: "Age 6-7",
    color: "#82d407",
  },
  {
    img: require("@assets/stm/bada-sound.png").default,
    level: "4",
    age: "Age 7-8",
    color: "#0fbff5",
  },
  {
    img: require("@assets/stm/bada-read.png").default,
    level: "5",
    age: "Age 8-9",
    color: "#f957a8",
  },
];

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url('${require("@assets/stm/bg2.jpg").default}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  mainContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    zIndex: 0,
  },
  title: {
    fontSize: vw(62),
    fontFamily: "rooneysansbold, sans-serif",
    color: "#fff",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: `repeat(5, ${vw(338)})`,
    gridColumnGap: vw(76),
  },
  item: {
    background: "#fff",
    width: vw(339),
    height: vw(436),
    borderRadius: vw(51),
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  itemLeve: {
    position: "absolute",
    display: "block",
    padding: "0",
    left: 0,
    right: 0,
    top: 0,
    bottom: "24.54%",
  },
  itemLeveText1: {
    color: "#fff",
    fontSize: vw(55),
    lineHeight: 2,
    textAlign: "center",
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
  itemLeveText2: {
    color: "#fff",
    fontSize: vw(244),
    fontStyle: "heavy",
    verticalAlign: "top",
    lineHeight: 0.6,
    textAlign: "center",
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
  itemImg: {
    position: "absolute",
    bottom: vw(21),
    left: vw(21),
    width: vw(108),
    height: vw(98),
    background: "#ffffff",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > img": {
      width: "90%",
    },
  },
  itemAge: {
    position: "absolute",
    bottom: vw(47),
    right: vw(34),
    fontSize: vw(42),
    lineHeight: 1.5,
    fontFamily: "RooneySans, sans-serif",
    fontWeight: "bold",
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
});

const IconButton = withStyles({
  root: {
    background: "#fff",
    width: vw(339),
    height: vw(435),
    borderRadius: vw(51),
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    "&:hover": {
      background: "#fff",
      borderColor: "none",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "none",
      borderColor: "none",
    },
  },
})(Button);

function LessonItem(props: ILessonData) {
  const history = useHistory();
  const css = useStyles();
  const { setRootState } = useContext(StmContext);
  let level: IContextState["classLevel"] = 1;

  return (
    <IconButton
      onClick={() => {
        history.push(pageLinks.lesson);
        setRootState && setRootState({ ...setRootState, classLevel: level });
      }}
    >
      <Box className={css.itemLeve} style={{ background: props.color }}>
        <Typography className={css.itemLeveText1}>Level</Typography>
        <Typography className={css.itemLeveText2}>{props.level}</Typography>
      </Box>
      <Box className={css.itemImg}>
        <img src={props.img} alt={props.level} />
      </Box>

      <Typography className={css.itemAge} style={{ color: props.color }}>
        {props.age}
      </Typography>
    </IconButton>
  );
}

export default function SelectClassLevel() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Header prevLink="/stm/curriculum" />
      <Box className={css.mainContainer}>
        <Box className={css.itemContainer}>
          {data.map((d) => {
            return <LessonItem key={d.level} {...d} />;
          })}
        </Box>
      </Box>
    </Box>
  );
}
