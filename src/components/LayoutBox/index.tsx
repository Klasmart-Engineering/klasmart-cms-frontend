import { Box, BoxProps, makeStyles } from "@material-ui/core";
import React, { ReactNode } from "react";

interface LayoutBoxProps {
  className?: string;
  mainStyle?: React.CSSProperties;
  mainBase: number;
  holderMin: number;
  holderBase: number;
  overflowX?: BoxProps["overflow"];
  children: ReactNode;
}

const useStyles = makeStyles({
  holder: (props: LayoutBoxProps) => ({
    flexGrow: 1,
    flexShrink: 1.5,
    flexBasis: props.holderBase,
    minWidth: props.holderMin,
  }),
  main: (props: LayoutBoxProps) => ({
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: props.mainBase,
    overflowX: props.overflowX || "visible",
  }),
});

export default function LayoutBox(props: LayoutBoxProps) {
  const css = useStyles(props);
  return (
    <Box display="flex" className={props.className}>
      <Box className={css.holder} />
      <Box className={css.main} style={props.mainStyle}>
        {props.children}
      </Box>
      <Box className={css.holder} />
    </Box>
  );
}
