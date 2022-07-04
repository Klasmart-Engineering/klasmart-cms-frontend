import { Box, Button, makeStyles } from "@material-ui/core";
import ExpandLessRoundedIcon from "@material-ui/icons/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { ParentSize } from "@visx/responsive";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
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
    margin: `${vw(9)} 0`,
    fontFamily: "RooneySans",
    fontWeight: 800,
    fontVariantNumeric: "lining-nums",
    fontFeatureSettings: "tnum",
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
    lineHeight: vw(56),
    fontWeight: 800,
    borderRadius: vw(40),
    "& span": {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      lineHeight: 1,
    },
    "&:hover": {
      background: "#6DC2FF",
    },
  },
  blank: {
    width: vw(106),
    height: vw(40),
  },
  unselected: {
    width: vw(106),
    height: vw(106),
    background: "#fff",
    color: "#2B9CF9",
    fontSize: vw(34),
    fontWeight: 800,
    borderRadius: vw(28),
    lineHeight: vw(43),
    "&:hover": {
      background: "#6DC2FF",
      color: "#fff",
    },
  },
  arrow: {
    zIndex: 2,
    width: vw(132),
    height: vw(132),
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    "& button": {
      height: vw(80),
      minWidth: "auto",
      borderRadius: "50%",
      padding: 0,
    },
    "& svg": {
      color: "#2475EA",
      margin: `-${vw(20)} 0`,
      fontSize: vw(80),
    },
  },
  bottomArrow: {
    bottom: 0,
    alignItems: "flex-end",
    background: "linear-gradient(0deg, #C5DDFF 30%, rgba(255, 255, 255, 0))",
  },
  topArrow: {
    top: 0,
    background: "linear-gradient(180deg, #C5DDFF 30%, rgba(255, 255, 255, 0))",
  },
  hidArrow: {
    background: "#ffffff00",
    zIndex: -1,
  },
});

interface Props {
  onChange: (unit: IUnitState) => void;
  chosenUnit?: string;
}

const dibit = (num: number) => (num < 10 ? `0${num}` : num);
export default function UnitsSelector(props: Props) {
  const css = useStyles();
  const [mock, setMock] = useState<IUnitState[]>([]);
  const [chosenIndex, setChosenIndex] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const swiper = useRef<SwiperType>();

  useEffect(() => {
    geUnits().then((res: IUnitState[]) => {
      const data = res.filter((item) => Boolean(item.lesson_plans?.length));
      setMock(data);
      props?.onChange?.(data[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsBeginning(true);
  }, [mock]);

  useEffect(() => {
    if (props.chosenUnit) {
      const index = mock.findIndex((unit) => unit.id === props.chosenUnit) ?? 0;
      setChosenIndex(index);
      swiper.current?.slideTo(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.chosenUnit]);

  const changeChosenIndex = (index: number) => {
    props?.onChange?.(mock[index]);
    setChosenIndex(index);
  };

  const onSlideChange = (event: SwiperType) => {
    setIsEnd(event.isEnd);
    setIsBeginning(event.isBeginning);
  };

  const slidePrev = () => {
    swiper.current?.slidePrev();
    swiper.current?.update();
  };

  const slideNext = () => {
    swiper.current?.slideNext();
    swiper.current?.update();
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
                centeredSlides={false}
                onSwiper={(ins) => {
                  swiper.current = ins;
                }}
                onUpdate={onSlideChange}
                onSlideChange={onSlideChange}
              >
                <SwiperSlide>
                  <Box className={clsx(css.item, css.blank)}></Box>
                </SwiperSlide>
                {mock.map((item, index) => {
                  if (index === chosenIndex) {
                    return (
                      <SwiperSlide key={index} className={css.swiperSlide}>
                        <Button onClick={() => changeChosenIndex(index)} className={clsx(css.item, css.selected)}>
                          <Box fontSize={vw(25)}>Unit</Box>
                          <Box>{dibit(item.no)}</Box>
                        </Button>
                      </SwiperSlide>
                    );
                  }
                  return (
                    <SwiperSlide key={index} className={css.swiperSlide}>
                      <Button onClick={() => changeChosenIndex(index)} className={clsx(css.item, css.unselected)}>
                        {dibit(item.no)}
                      </Button>
                    </SwiperSlide>
                  );
                })}
                <SwiperSlide>
                  <Box className={clsx(css.item, css.blank)}></Box>
                </SwiperSlide>
              </Swiper>
            </Box>
            <Box className={clsx(css.arrow, css.topArrow, isBeginning ? [css.hidArrow] : [])}>
              <Button onClick={slidePrev} style={{ visibility: isBeginning ? "hidden" : "visible" }}>
                <ExpandLessRoundedIcon />
              </Button>
            </Box>
            <Box className={clsx(css.arrow, css.bottomArrow, isEnd ? [css.hidArrow] : [])}>
              <Button onClick={slideNext} style={{ visibility: isEnd ? "hidden" : "visible" }}>
                <ExpandMoreRoundedIcon />
              </Button>
            </Box>
          </>
        );
      }}
    </ParentSize>
  );
}
