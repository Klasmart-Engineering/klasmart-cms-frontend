import { Box, Button, Card, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { pageLinks, StmContext } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  teachingUnitWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  teachingunit: {
    display: "flex",
    width: vw(670),
    height: vw(300),
    backgroundColor: "#C572FF",
    borderRadius: vw(46),
    padding: `${vw(19)} 0 ${vw(19)} ${vw(19)}`,
    marginRight: vw(32),
    boxSizing: "border-box",
  },
  content: {
    display: "flex",
    width: vw(300),
    flexDirection: "column",
    position: "relative",
  },
  unitBtn: {
    height: vw(35),
    padding: `0 ${vw(10)}`,
    lineHeight: vw(35),
    color: "#C572FF",
    borderRadius: vw(17),
    fontSize: vw(21),
    fontWeight: 800,
    backgroundColor: "#FFFFFF",
  },
  lessonNo: {
    display: "inline-block",
    marginLeft: vw(8),
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: vw(29),
  },
  lessonDesp: {
    width: "100%",
    marginTop: vw(20),
    fontWeight: 700,
    fontSize: vw(23),
    lineHeight: vw(27),
    color: "#FFFFFF",
  },
  cover: {
    width: vw(350),
    height: vw(262),
    borderRadius: vw(30),
    backgroundColor: "#C4C4C4",
  },
  continueBtn: {
    width: vw(233),
    position: "absolute",
    bottom: vw(20),
    color: "#FFFFFF",
    backgroundColor: "#942CE5",
    fontWeight: 700,
    borderRadius: vw(24),
    padding: `${vw(9)} ${vw(63)} ${vw(12)} ${vw(63)}`,
  },
});

export default function TeachingUnit(props: { list: ITeachingList[] }) {
  const css = useStyles();
  let history = useHistory();
  const { setRootState } = useContext(StmContext);
  const handleClick = (payload: ITeachingList) => {
    setRootState && setRootState({ planId: payload.id });
    history.push(pageLinks.present);
  };

  return (
    <Box className={css.teachingUnitWrap}>
      {props.list.map((item: any, index: any) => (
        <Card key={index} className={css.teachingunit}>
          <CardMedia className={css.cover} image={item.thumbnail} title="" />
          <Box className={css.content}>
            <CardContent>
              <Grid container item xs={12} spacing={1}>
                <label className={css.unitBtn}>{item.unitId}</label>
                <span className={css.lessonNo}>Lesson {item.no}</span>
              </Grid>
              <Typography className={css.lessonDesp} component="p">
                {item.name}
              </Typography>
              <Button
                variant="contained"
                className={css.continueBtn}
                disableElevation
                onClick={() => {
                  handleClick(item);
                }}
              >
                Continue <ChevronRightIcon></ChevronRightIcon>
              </Button>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
