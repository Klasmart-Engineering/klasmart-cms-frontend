import { Box, Button, makeStyles, Typography, withStyles } from "@material-ui/core";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { pageLinks } from ".";
import Header from "./components/Header";
import { StmContext } from "./contexts";
import vw from "./utils/vw.macro";

const data: ILessonData[] = [
  {
    img: require("@assets/stm/bada-rhyme.png").default,
    level: "1",
    age: "Age 4-5",
    color: "#c572ff",
    top: vw(22),
    title: "Bada Rhyme",
  },
  {
    img: require("@assets/stm/bada-genius.png").default,
    level: "2",
    age: "Age 5-6",
    color: "#fbc319",
    top: vw(152),
    title: "Bada Genius",
  },
  {
    img: require("@assets/stm/bada-talk.png").default,
    level: "3",
    age: "Age 6-7",
    color: "#82d407",
    top: 0,
    title: "Bada Talk",
  },
  {
    img: require("@assets/stm/bada-sound.png").default,
    level: "4",
    age: "Age 7-8",
    color: "#0fbff5",
    top: vw(92),
    title: "Bada Sound",
  },
  {
    img: require("@assets/stm/bada-read.png").default,
    level: "5",
    age: "Age 8-9",
    color: "#f957a8",
    top: vw(22),
    title: "Bada Read",
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
    display: "flex",
    gap: vw(76),
    height: vw(588),
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
    "&::before": {
      position: "absolute",
      display: "block",
      content: "''",
      width: vw(30),
      height: vw(20),
      left: vw(24),
      top: vw(24),
      borderRadius: "100%",
      background: "#fff",
      opacity: 0.6,
      transform: "matrix(0.71, -0.71, 0.71, 0.71, 0, 0)",
    },
  },
  itemLeveText1: {
    position: "absolute",
    width: "100%",
    color: "#fff",
    fontSize: vw(55),
    lineHeight: vw(69),
    paddingTop: vw(20),
    textAlign: "center",
    fontFamily: "RooneySans-Black, sans-serif",
    fontWeight: 900,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
  itemLeveText2: {
    position: "absolute",
    width: "100%",
    color: "#fff",
    fontSize: vw(244),
    fontStyle: "heavy",
    verticalAlign: "top",
    lineHeight: vw(305),
    paddingTop: vw(36),
    textAlign: "center",
    fontFamily: "RooneySans, sans-serif",
    fontWeight: 900,
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
    bottom: vw(46),
    right: vw(32),
    fontSize: vw(42),
    lineHeight: vw(52),
    fontFamily: "RooneySans, sans-serif",
    fontWeight: 900,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
  },
});

const IconButton = withStyles({
  root: {
    background: "#fff",
    width: vw(339),
    height: vw(435),
    borderRadius: vw(60),
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
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
  const { setRootState, ...rootState } = useContext(StmContext);

  return (
    <IconButton
      style={{
        top: props.top,
      }}
      onClick={() => {
        history.push(pageLinks.lesson);
        setRootState &&
          setRootState({ ...rootState, classLevel: props.level as unknown as IContextState["classLevel"], title: props.title });
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
