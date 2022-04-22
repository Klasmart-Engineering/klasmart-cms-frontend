import { Box, makeStyles } from "@material-ui/core";
import ExpandLessRoundedIcon from "@material-ui/icons/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { ParentSize } from "@visx/responsive";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/pagination/pagination.min.css";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import "swiper/swiper.min.css";
import { geUnits } from "../utils/api";
import vw from "../utils/vw.macro";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#42BDFF",
    width: "100vw",
    height: "100vh",
  },
  container: {
    overflow: "hidden",
  },
  item: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    margin: `${vw(11)} 0`,
  },
  swiperSlide: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    width: vw(132),
    height: vw(132),
    background: "#2B9CF9",
    color: "#fff",
    fontSize: vw(45),
    fontWeight: 800,
    borderRadius: vw(40),
  },
  blank: {
    width: vw(106),
    height: vw(106),
  },
  unselected: {
    width: vw(106),
    height: vw(106),
    background: "#fff",
    color: "#2B9CF9",
    fontSize: vw(34),
    fontWeight: 800,
    borderRadius: vw(28),
    "&:hover": {
      background: "#6DC2FF",
      color: "#fff",
    },
  },
  arrow: {
    zIndex: 2,
    width: vw(132),
    height: vw(132),
    color: "#2475EA",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    "& svg": {
      fontSize: vw(80),
    },
  },
  bottomArrow: {
    bottom: 0,
    alignItems: "flex-end",
    background: "linear-gradient(0deg, #C5DDFF 30%, transparent)",
  },
  topArrow: {
    top: 0,
    background: "linear-gradient(180deg, #C5DDFF 30%, transparent)",
  },
});

interface Props {
  onChange: (unit: any) => void;
}
export default function UnitsSelector(props: Props) {
  const css = useStyles();
  const [mock, setMock] = useState<any[]>([]);
  const [chosenIndex, setChosenIndex] = useState(0);
  const swiper = useRef<any>();

  useEffect(() => {
    geUnits().then((res) => {
      setMock(res);
      props?.onChange?.(res[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeChosenIndex = (index: number) => {
    props?.onChange?.(mock[index]);
    setChosenIndex(index);
  };

  return (
    <ParentSize style={{ position: "relative", height: "100%" }}>
      {({ height }) => {
        return (
          <>
            <Box className={css.container} height={height} position={"absolute"}>
              <Swiper
                slidesPerView={"auto"}
                direction={"vertical"}
                style={{ height }}
                autoHeight
                freeMode
                setWrapperSize
                onSwiper={(ins) => {
                  swiper.current = ins;
                }}
              >
                <SwiperSlide>
                  <Box className={clsx(css.item, css.blank)}></Box>
                </SwiperSlide>
                {mock.map((item, index) => {
                  if (index === chosenIndex) {
                    return (
                      <SwiperSlide key={index} className={css.swiperSlide}>
                        <Box onClick={() => changeChosenIndex(index)} className={clsx(css.item, css.selected)}>
                          <Box fontSize={vw(25)}>Unit</Box>
                          <Box>{item.name}</Box>
                        </Box>
                      </SwiperSlide>
                    );
                  }
                  return (
                    <SwiperSlide key={index} className={css.swiperSlide}>
                      <Box onClick={() => changeChosenIndex(index)} className={clsx(css.item, css.unselected)}>
                        {item.name}
                      </Box>
                    </SwiperSlide>
                  );
                })}
                <SwiperSlide>
                  <Box className={clsx(css.item, css.blank)}></Box>
                </SwiperSlide>
              </Swiper>
            </Box>
            <Box className={clsx(css.arrow, css.topArrow)}>
              <ExpandLessRoundedIcon onClick={() => swiper.current.slidePrev()} />
            </Box>
            <Box className={clsx(css.arrow, css.bottomArrow)}>
              <ExpandMoreRoundedIcon onClick={() => swiper.current.slideNext()} />
            </Box>
          </>
        );
      }}
    </ParentSize>
  );
}
