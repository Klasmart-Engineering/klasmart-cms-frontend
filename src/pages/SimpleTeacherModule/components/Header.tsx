import backArrow from "@assets/stm/arrow.svg";
import { Box, IconButton, Link, makeStyles, withStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const BackButton = withStyles({
  root: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
  label: {
    "& > img": {
      width: "1.17vw",
      marginLeft: -5,
    },
  },
})(IconButton);

const useStyles = makeStyles({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    padding: "1vw",
    zIndex: 10,
  },
  backBtn: {
    background: "#fff",
    width: "2.81vw",
    height: "2.81vw",
    borderRadius: "100%",
  },
});
export default function Header(props: { prevLink: string; backgroudColor?: React.CSSProperties["backgroundColor"] }) {
  const css = useStyles();
  let history = useHistory();
  return (
    <Link
      component="button"
      variant="body2"
      onClick={() => {
        history.push(props.prevLink);
      }}
    >
      <Box
        className={css.root}
        style={{
          backgroundColor: props.backgroudColor || "transpant",
        }}
      >
        <BackButton aria-label="back" className={css.backBtn}>
          <img src={backArrow} alt="back" />
        </BackButton>
      </Box>
    </Link>
  );
}
