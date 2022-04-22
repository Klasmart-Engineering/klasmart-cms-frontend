import { Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { pageLinks } from "./index";
import vw from "./utils/vw.macro";

const useStyles = makeStyles({
  lessonunitWrap: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  lessonunit: {
    width: vw(320),
    height: vw(312),
    backgroundColor: "#FFFFFF",
    borderRadius: vw(32),
    marginRight: vw(31),
  },
  content: {
    padding: vw(12),
  },
  lessonPic: {
    height: vw(181),
    backgroundColor: "#C4C4C4",
  },
  lessonNo: {
    color: "#43A1FF",
    fontWeight: 700,
    fontSize: vw(24),
    lineHeight: vw(30),
  },
  lessonDesp: {
    color: "#444444",
    fontWeight: 500,
    fontSize: vw(21),
    lineHeight: vw(27),
  },
});

export default function LessonUnit(props: any) {
  const css = useStyles();
  let history = useHistory();
  // useEffect(() => {
  //   console.log(JSON.stringify(props));
  // }, []);
  return (
    <div className={css.lessonunitWrap}>
      {props.list.map((item: any, index: any) => (
        <Card key={index} className={css.lessonunit}>
          <CardActionArea>
            <CardMedia className={css.lessonPic} component="img" image={item.thumbnail} title="" />
            <CardContent
              className={css.content}
              onClick={() => {
                history.push(pageLinks.present);
              }}
            >
              <Typography className={css.lessonNo}>
                {/* Lesson 01 */}
                Lesson {item.no}
              </Typography>
              <Typography className={css.lessonDesp} component="p">
                {/* Story Book - Teddy Bear, Teddy Bear, Say Goodnight */}
                {item.name}-{item.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </div>
  );
}
