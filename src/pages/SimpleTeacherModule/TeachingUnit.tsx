import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory } from "react-router-dom";
import { pageLinks } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingunit: {
    display: "flex",
    width: vw(670),
    height: vw(300),
    backgroundColor: "#C572FF",
    borderRadius: vw(46),
    padding: vw(19),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  unitBtn: {
    height: vw(35),
    padding: vw(7),
    color: "#C572FF",
    borderRadius: vw(17),
    fontSize: vw(21),
    fontWeight: 800,
    backgroundColor: "#FFFFFF",
  },
  lessonNo: {
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: vw(29),
  },
  lessonDesp: {
    marginTop: vw(17),
    fontWeight: 700,
    fontSize: vw(23),
    lineHeight: vw(27),
    color: "#FFFFFF",
  },
  cover: {
    width: vw(350),
    height: vw(300),
    borderRadius: vw(30),
    backgroundColor: "#C4C4C4",
  },
  continueBtn: {
    position: "absolute",
    bottom: vw(20),
    color: "#FFFFFF",
    backgroundColor: "#942CE5",
    fontWeight: 700,
    borderRadius: vw(24),
    paddingTop: vw(9),
    paddingBottom: vw(12),
    paddingLeft: vw(63),
    paddingRight: vw(105),
  },
});

export default function TeachingUnit() {
  const css = useStyles();
  let history = useHistory();
  return (
    <Box>
      <Card className={css.teachingunit}>
        <CardMedia className={css.cover} image="" title="" />
        <Box className={css.content}>
          <CardContent>
            <Box>
              <Grid container spacing={1}>
                <Grid container item xs={4} spacing={1}>
                  <Button variant="contained" className={css.unitBtn} disableElevation>
                    Unit 06
                  </Button>
                </Grid>
                <Grid container item xs={8} spacing={1}>
                  <span className={css.lessonNo}>Lesson 11</span>
                </Grid>
              </Grid>
            </Box>
            <Typography className={css.lessonDesp} component="p">
              Teddy Bear, Teddy Bear, Say Goodnight
            </Typography>
            <Button
              variant="contained"
              className={css.continueBtn}
              disableElevation
              onClick={() => {
                history.push(pageLinks.present);
              }}
            >
              Continue <ChevronRightIcon></ChevronRightIcon>
            </Button>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
}
