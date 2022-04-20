import { Box, makeStyles, Typography } from "@material-ui/core";
import Header from "./components/Header";

const data: ILessonData[] = [
  {
    img: require("@assets/inclass/bada-rhyme.png").default,
    level: "1",
    age: "Age 4-5",
    color: "#c572ff",
  },
  {
    img: require("@assets/inclass/bada-genius.png").default,
    level: "2",
    age: "Age 5-6",
    color: "#fbc319",
  },
  {
    img: require("@assets/inclass/bada-talk.png").default,
    level: "3",
    age: "Age 6-7",
    color: "#82d407",
  },
  {
    img: require("@assets/inclass/bada-sound.png").default,
    level: "4",
    age: "Age 7-8",
    color: "#0fbff5",
  },
  {
    img: require("@assets/inclass/bada-read.png").default,
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
    backgroundImage: `url('${require("@assets/inclass/bg2.jpg").default}')`,
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
    fontSize: 62,
    fontFamily: "rooneysansbold, sans-serif",
    color: "#fff",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 13.2vw)",
    gridColumnGap: "2.96vw",
  },
  item: {
    background: "#fff",
    width: "13.2vw",
    height: "17vw",
    borderRadius: "2vw",
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
    fontSize: "2.15vw",
    lineHeight: 1.5,
    textAlign: "center",
    fontFamily: "rooneysansbold, sans-serif",
  },
  itemLeveText2: {
    color: "#fff",
    fontSize: "9.5vw",
    fontStyle: "heavy",
    verticalAlign: "top",
    lineHeight: 0.6,
    textAlign: "center",
    fontFamily: "rooneysansbold, sans-serif",
  },
  itemImg: {
    position: "absolute",
    bottom: ".8vw",
    left: ".8vw",
    width: "4.21vw",
    height: "4.21vw",
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
    bottom: "1.1vw",
    right: "1.1vw",
    fontSize: "1.64vw",
    lineHeight: 1.5,
    fontFamily: "rooneysansbold, sans-serif",
  },
});

function LessonItem(props: ILessonData) {
  const css = useStyles();
  return (
    <Box className={css.item}>
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
    </Box>
  );
}

export default function SelectClassLevel() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Header prevLink="/inclass/curriculum" />
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
