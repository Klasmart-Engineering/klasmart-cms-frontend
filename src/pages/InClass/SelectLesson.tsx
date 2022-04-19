import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {},
});

export default function SelectLesson() {
  const css = useStyles();
  return <Box className={css.root}></Box>;
}
