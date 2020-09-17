import { Box, FormControl, makeStyles, Select, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import noOutcomes from "../../assets/icons/noLearningOutcomes.svg";

const useStyles = makeStyles(({ palette, shadows }) => ({
  noOutComesImage: {
    marginTop: 100,
    marginBottom: 20,
    width: 578,
    height: 578,
  },
  emptyDesc: {
    position: "absolute",
    bottom: 100,
  },
  selectButton: {
    width: 160,
    marginBotton: 20,
    backgroundColor: "white",
    borderRadius: 4,
    boxShadow: shadows[3],
    color: palette.text.primary,
  },
}));

export function NoOutComesList() {
  const css = useStyles();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative">
      <img className={css.noOutComesImage} alt="empty" src={noOutcomes} />
      <Typography className={css.emptyDesc} variant="body1" color="textSecondary">
        No learning outcome is available.
      </Typography>
    </Box>
  );
}
export interface OutcomesFilterProps {
  value: string;
  onChange?: (vale: OutcomesFilterProps["value"]) => any;
}
export function OutcomesFilter(props: OutcomesFilterProps) {
  const css = useStyles();
  const { value = "all", onChange } = props;
  const handleChange = useCallback(
    (e) => {
      if (onChange) onChange(e.target.value);
    },
    [onChange]
  );
  return (
    <Box display="flex" justifyContent="flex-end" mb={2}>
      <FormControl variant="outlined" size="small" className={css.selectButton}>
        <Select native defaultValue={value} onChange={handleChange}>
          <option value="all">All </option>
          <option value="assumed">Assumed </option>
          <option value="unassumed">Unassumed </option>
        </Select>
      </FormControl>
    </Box>
  );
}