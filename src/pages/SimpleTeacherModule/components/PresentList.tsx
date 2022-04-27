import { Box, Button, Container, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { usePresentState } from "../hooks/rootState";
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
    overflowY: "auto",
    overflowX: "hidden",
    paddingLeft: vw(18),
  },
  itemWrapper: {
    width: vw(258),
    display: "grid",
    gridTemplateColumns: vw(258),
    gridRowGap: vw(46),
    margin: "0 auto",
    marginTop: vw(49),
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
  const itemButton = useRef<HTMLButtonElement>();
  const { presentState, setPresentState } = usePresentState();
  useEffect(() => {
    if (presentState.activeIndex && presentState.activeIndex >= 0 && container.current) {
      container.current.scrollTo({ top: itemButton.current?.offsetTop, left: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentState.activeIndex]);

  return (
    <Box className={css.root}>
      <Container className={css.listMain} innerRef={container}>
        <Box className={css.itemWrapper}>
          {props.list.map((item, index) => {
            const isActive = index === presentState.activeIndex;
            return (
              <ListItem
                itemRef={(button) => {
                  if (isActive) {
                    itemButton.current = button;
                  }
                }}
                key={index}
                active={isActive}
                thumbnail={item.thumbnail}
                onClick={() => {
                  setPresentState({ activeIndex: index });
                }}
              />
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
