import { Box, Button, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { px2vw } from "../utils";

const useStyles = makeStyles({
  root: {
    position: "relative",
    height: "100vh",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #f0f0f0",
    borderRight: "1px solid #f0f0f0",
    width: px2vw(310),
  },
  listMain: {
    position: "absolute",
    top: px2vw(40),
    bottom: px2vw(40),
    left: 0,
    right: 0,
    width: px2vw(310),
    overflowY: "auto",
  },
  itemWrapper: {
    width: px2vw(258),
    display: "grid",
    gridTemplateColumns: px2vw(258),
    gridRowGap: px2vw(46),
    margin: "0 auto",
  },
  item: {
    width: px2vw(258),
    height: px2vw(145),
    borderRadius: px2vw(22),
    background: "#ccc",
    backgroundSize: "cover",
    border: `${px2vw(8)} solid #f0f0f0`,
    "&.active": {
      //width: px2vw(242),
      //height: px2vw(129),
      border: `${px2vw(8)} solid #2475EA`,
    },
  },
});

function ListItem(props: IListItemProps) {
  const css = useStyles();
  return (
    <Button
      className={clsx(css.item, {
        active: props.active,
      })}
      style={{
        backgroundImage: `url(${props.thumbnail})`,
      }}
      onClick={props.onClick}
    ></Button>
  );
}
export default function PresentList(props: IPresentListProps) {
  const css = useStyles();
  return (
    <Box className={css.root}>
      <Box className={css.listMain}>
        <Box className={css.itemWrapper}>
          {props.list.map((item, index) => (
            <ListItem key={index} active={index === props.activeIndex} thumbnail={item.thumbnail} onClick={() => props.onClick(index)} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
