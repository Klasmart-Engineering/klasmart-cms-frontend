import { Box, Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { px2vw } from "./utils/index";

const useStyles = makeStyles({
  lessonunit: {
    width: px2vw(320),
    height: px2vw(312),
    backgroundColor: "#FFFFFF",
    borderRadius: px2vw(32),
  },
  content: {
    padding: px2vw(12),
  },
  lessonPic: {
    height: px2vw(181),
    backgroundColor: "#C4C4C4",
  },
  lessonNo: {
    color: "#43A1FF",
    fontWeight: 700,
    fontSize: px2vw(24),
    lineHeight: px2vw(30),
  },
  lessonDesp: {
    color: "#444444",
    fontWeight: 500,
    fontSize: px2vw(21),
    lineHeight: px2vw(27),
  },
});

export default function LessonUnit() {
  const css = useStyles();
  return (
    <Box>
      <Card className={css.lessonunit}>
        <CardActionArea>
          <CardMedia className={css.lessonPic} component="img" image="/static/images/cards/contemplative-reptile.jpg" title="" />
          <CardContent className={css.content}>
            <Typography className={css.lessonNo}>Lesson 01</Typography>
            <Typography className={css.lessonDesp} component="p">
              Story Book - Teddy Bear, Teddy Bear, Say Goodnight
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
}
