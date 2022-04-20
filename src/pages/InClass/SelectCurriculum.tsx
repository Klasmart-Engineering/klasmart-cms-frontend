import eslImg from "@assets/inclass/esl.png";
import steamImg from "@assets/inclass/steam.png";
import { Box, Link, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url('${require("@assets/inclass/bg.jpg").default}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    fontSize: "2.7vw",
    paddingBottom: "2.1vw",
    fontFamily: "rooney-sans, sans-serif",
    color: "#274EAF",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: "25.3vw 25.3vw",
    gridColumnGap: "1.7vw",
  },
  item: {
    background: "#fff",
    width: "25.3vw",
    height: "15.3vw",
    borderRadius: "80px 40px 80px 80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& > img": {
      scale: ".8",
    },
  },
});

function CurriculumItem(props: { name: string }) {
  let history = useHistory();
  const css = useStyles();
  return (
    <Link
      component="button"
      variant="body2"
      onClick={() => {
        history.push("/inclass/level");
      }}
    >
      <Box className={css.item}>
        <img src={props.name === "steam" ? steamImg : eslImg} alt={props.name} />
      </Box>
    </Link>
  );
}

export default function SelectCurriculum() {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Typography className={css.title} variant="h3">
        Select your curriculum
      </Typography>
      <Box className={css.itemContainer}>
        <CurriculumItem name="esl" />
        <CurriculumItem name="steam" />
      </Box>
    </Box>
  );
}
