/// <reference path="index.d.ts" />
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";
import isEqual from "lodash/isEqual";
import React from "react";
import useTranslation from "../../pages/ReportStudentUsage/hooks/useTranslation";

interface IMutiSelectProps {
  options: MutiSelect.ISelect[];
  label?: string;
  disabled?: boolean;
  onChange?: (value: MutiSelect.ISelect[]) => void;
  onInitial?: (value: MutiSelect.ISelect[]) => void;
  defaultValueIsAll?: boolean;
  id?: string;
}
interface IMutiSelectState {
  value: string[];
  allSelected: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    multipleSelectBox: {
      width: "100%",
    },
    multipleSelectBoxFocused: {},
  })
);

export default React.memo(
  ({ id, options: allOptions, label, disabled, defaultValueIsAll, onChange, onInitial }: IMutiSelectProps) => {
    const { allValue } = useTranslation();
    const classes = useStyles();
    const [focused, setFocused] = React.useState<boolean>(false);
    const [state, setState] = React.useState<IMutiSelectState>({
      value: defaultValueIsAll ? [allValue] : [],
      allSelected: !!defaultValueIsAll,
    });
    const resetState = () => {
      setState({
        ...state,
        value: defaultValueIsAll ? [allValue] : [],
        allSelected: !!defaultValueIsAll,
      });
      onInitial && onInitial(allOptions.slice(1, allOptions.length));
      //!disabled && onInitial && onInitial(allOptions.slice(1, allOptions.length));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(resetState, [id, allOptions]);

    const onSelectChange = (event: SelectChangeEvent<string[]>) => {
      let value = event.target.value as string[];
      if (value.length === 0) {
        return;
      }
      if (value.indexOf(allValue) > -1) {
        if (state.value.indexOf(allValue) === -1) {
          value = [allValue];
        } else {
          value = value.filter((v) => v !== allValue);
        }
      }
      setState({
        ...state,
        value,
      });
    };

    const onOpenSelect = () => {
      setFocused(true);
    };
    const onCloseSelect = () => {
      let cbValues = [];
      if (state.value.length === 1 && state.value[0] === allValue) {
        cbValues = allOptions.slice(1, allOptions.length);
      } else {
        cbValues = allOptions.filter((item) => state.value.indexOf(item.value) >= 0);
      }
      onChange && onChange(cbValues);
      setFocused(false);
    };

    return (
      <FormControl
        size="small"
        variant="outlined"
        className={clsx({
          [classes.multipleSelectBox]: true,
          [classes.multipleSelectBoxFocused]: focused,
        })}
      >
        <InputLabel>{label}</InputLabel>
        <Select
          fullWidth
          multiple
          displayEmpty
          value={state.value}
          onChange={onSelectChange}
          label={label}
          disabled={disabled}
          onOpen={onOpenSelect}
          onClose={onCloseSelect}
          inputProps={{ "aria-label": "Without label" }}
        >
          {allOptions.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.disabled, nextProps.disabled) &&
      isEqual(prevProps.id, nextProps.id) &&
      isEqual(prevProps.options, nextProps.options)
    );
  }
);
