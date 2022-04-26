import { Box, Button, Container, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import vw from "../utils/vw.macro";
const useStyles = makeStyles({
  root: {
    position: "relative",
    height: "100vh",
    backgroundColor: "#ffffff",
    borderLeft: "1px solid #f0f0f0",
    borderRight: "1px solid #f0f0f0",
    width: vw(310),
  },
  listMain: {
    position: "absolute",
    top: vw(40),
    bottom: vw(40),
    left: 0,
    right: 0,
    width: vw(310),
    overflowY: "auto",
  },
  itemWrapper: {
    width: vw(258),
    display: "grid",
    gridTemplateColumns: vw(258),
    gridRowGap: vw(46),
    margin: "0 auto",
  },
  item: {
    width: vw(258),
    height: vw(145),
    borderRadius: vw(22),
    background: "#ccc",
    backgroundSize: "cover",
    border: `${vw(8)} solid #f0f0f0`,
    "&.active": {
      border: `${vw(8)} solid #2475EA`,
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
      ref={props.itemRef}
      style={{
        backgroundImage: `url(${props.thumbnail})`,
      }}
      onClick={props.onClick}
    ></Button>
  );
}
export default function PresentList(props: IPresentListProps) {
  const css = useStyles();
  const container = useRef<HTMLDivElement>();
  const itemButtons = useRef<HTMLButtonElement[]>([]);
  const isCmdChange = useRef(false);

  const scroll = () => {
    if (props.list.length && container.current) {
      container.current.scrollTo({ top: itemButtons.current[props.activeIndex]?.offsetTop, left: 0, behavior: "smooth" });
    }
    isCmdChange.current = false;
  };

  const onClick = (index: number) => {
    isCmdChange.current = true;
    props.onClick(index);
  };

  useEffect(() => {
    if (!isCmdChange.current) {
      scroll();
    } else {
      isCmdChange.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.activeIndex]);

  return (
    <Box className={css.root}>
      <Container className={css.listMain} innerRef={container}>
        <Box className={css.itemWrapper}>
          {props.list.map((item, index) => (
            <ListItem
              itemRef={(button) => (itemButtons.current[index] = button)}
              key={index}
              active={index === props.activeIndex}
              thumbnail={item.thumbnail}
              onClick={() => onClick(index)}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
