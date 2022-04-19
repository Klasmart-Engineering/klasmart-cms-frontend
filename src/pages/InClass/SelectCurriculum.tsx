import eslImg from "@assets/inclass/esl.png";
import steamImg from "@assets/inclass/steam.png";
import { Box, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    fontSize: 62,
    fontFamily: "rooney-sans, sans-serif",
    color: "#fff",
  },
  itemContainer: {
    display: "grid",
    gridTemplateColumns: "426px 426px",
    gridColumnGap: "70px",
    padding: 75,
  },
  item: {
    background: "#fff",
    width: 426,
    height: 398,
    borderRadius: "80px 40px 80px 80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
});

function CurriculumItem(props: { name: string }) {
  const css = useStyles();
  return (
    <Box className={css.item}>
      <img src={props.name === "steam" ? steamImg : eslImg} alt="curriculum" />
    </Box>
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
        <CurriculumItem name="steam" />
        <CurriculumItem name="esl" />
      </Box>
    </Box>
  );
}
