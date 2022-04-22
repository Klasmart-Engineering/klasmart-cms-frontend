import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory } from "react-router-dom";
import { pageLinks } from "./index";
import { px2vw } from "./utils/index";

const useStyles = makeStyles({
  teachingunit: {
    display: "flex",
    width: px2vw(670),
    height: px2vw(300),
    backgroundColor: "#C572FF",
    borderRadius: px2vw(46),
    padding: px2vw(19),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  unitBtn: {
    height: px2vw(35),
    padding: px2vw(7),
    color: "#C572FF",
    borderRadius: px2vw(17),
    fontSize: px2vw(21),
    fontWeight: 800,
    backgroundColor: "#FFFFFF",
  },
  lessonNo: {
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: px2vw(29),
  },
  lessonDesp: {
    marginTop: px2vw(17),
    fontWeight: 700,
    fontSize: px2vw(23),
    lineHeight: px2vw(27),
    color: "#FFFFFF",
  },
  cover: {
    width: px2vw(350),
    height: px2vw(300),
    borderRadius: px2vw(30),
    backgroundColor: "#C4C4C4",
  },
  continueBtn: {
    position: "absolute",
    bottom: px2vw(20),
    color: "#FFFFFF",
    backgroundColor: "#942CE5",
    fontWeight: 700,
    borderRadius: px2vw(24),
    paddingTop: px2vw(9),
    paddingBottom: px2vw(12),
    paddingLeft: px2vw(63),
    paddingRight: px2vw(105),
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
