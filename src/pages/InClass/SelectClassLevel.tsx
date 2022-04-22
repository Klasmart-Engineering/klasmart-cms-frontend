import { Box, makeStyles, Typography } from "@material-ui/core";
import Header from "./components/Header";

const data: ILessonData[] = [
  {
    img: require("@assets/inclass/bada-rhyme.png").default,
    level: "Level 1",
    age: "Age 4-5",
    color: "#c572ff",
  },
  {
    img: require("@assets/inclass/bada-genius.png").default,
    level: "Level 2",
    age: "Age 5-6",
    color: "#fbc319",
  },
  {
    img: require("@assets/inclass/bada-talk.png").default,
    level: "Level 3",
    age: "Age 6-7",
    color: "#82d407",
  },
  {
    img: require("@assets/inclass/bada-sound.png").default,
    level: "Level 4",
    age: "Age 7-8",
    color: "#0fbff5",
  },
  {
    img: require("@assets/inclass/bada-read.png").default,
    level: "Level 5",
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
    fontFamily: "rooney-sans, sans-serif",
    color: "#fff",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 200px)",
    gridColumnGap: "40px",
    padding: 75,
  },
  item: {
    background: "#fff",
    width: 200,
    height: 200,
    borderRadius: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  itemImg: {
    width: "50%",
    "& > img": {
      width: "100%",
    },
  },
  itemLeve: {
    display: "block",
    padding: "0 10px",
    borderRadius: 6,
  },
  itemLeveText: {
    color: "#fff",
    fontSize: 14,
  },
  itemAge: {
    fontSize: 14,
    lineHeight: 1.5,
  },
});

function LessonItem(props: ILessonData) {
  const css = useStyles();
  return (
    <Box className={css.item}>
      <Box className={css.itemImg}>
        <img src={props.img} alt={props.level} />
      </Box>
      <Box className={css.itemLeve} style={{ background: props.color }}>
        <Typography className={css.itemLeveText}>{props.level}</Typography>
      </Box>
      <Typography className={css.itemAge}>{props.age}</Typography>
    </Box>
  );
}

export default function SelectClassLevel() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Header prevLink="/inclass/curriculum" />
      <Box className={css.mainContainer}>
        <Typography className={css.title} variant="h3">
          Select your class level
        </Typography>
        <Box className={css.itemContainer}>
          {data.map((d) => {
            return <LessonItem key={d.level} {...d} />;
          })}
        </Box>
      </Box>
    </Box>
  );
}
