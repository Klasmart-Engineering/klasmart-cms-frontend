import { Box, Button, Container, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useContext, useEffect, useRef } from "react";
import { StmContext } from "..";
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
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: vw(310),
    overflowY: "auto",
    overflowX: "hidden",
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
    border: `1px solid #B7B7B7`,
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
  const { setRootState, ...rootState } = useContext(StmContext);
  const { presentState } = rootState;
  const { activeIndex = 0 } = presentState || {};

  const scroll = () => {
    if (props.list.length && container.current) {
      container.current.scrollTo({ top: itemButtons.current[activeIndex]?.offsetTop, left: 0, behavior: "smooth" });
    }
    isCmdChange.current = false;
  };

  const onClick = (index: number) => () => {
    setRootState &&
      setRootState({
        ...rootState,
        presentState: {
          ...presentState,
          activeIndex: index,
        },
      });
  };

  useEffect(() => {
    if (!isCmdChange.current) {
      scroll();
    } else {
      isCmdChange.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <Box className={css.root}>
      <Container className={css.listMain} innerRef={container}>
        <Box className={css.itemWrapper}>
          {props.list.map((item, index) => (
            <ListItem
              itemRef={(button) => (itemButtons.current[index] = button)}
              key={index}
              active={index === activeIndex}
              thumbnail={item.thumbnail}
              onClick={onClick(index)}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
