import { Box, Checkbox, createStyles, makeStyles, MenuItem, TextField, Theme } from "@material-ui/core";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../../locale/LocaleManager";
import { RootState } from "../../../reducers";

interface ISelect {
  label: string;
  value: string;
}

interface IProps {
  onChange?: (value: ISelect[]) => void;
  onClose?: () => void;
}

interface IState {
  schoolId: string;
  classes: ISelect[];
}

type IOptions = ISelect[][];
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    schoolContainer: {
      display: "flex",
      flexDirection: "row",
      position: "relative",
    },
    schoolBox: {
      width: 180,
      paddingRight: 320,
    },
    multipleSelectBox: {
      top: 0,
      right: 0,
      position: "absolute",
      width: 300,
      background: "#fff",
      zIndex: 1000,
      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
    classBox: {},
    contentContainer: {
      display: "flex",
      position: "relative",
      marginTop: 20,
    },
    contentBox: {},
    tagSizeSmall: {
      maxWidth: "calc(100% - 100px)",
    },
  })
);

interface IMutiSelectProps {
  limitTags?: number;
  options: ISelect[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: ISelect[]) => void;
  onClose?: () => void;
}
interface IMutiSelectState {
  value: ISelect[];
  allSelected: boolean;
}
function MutiSelect({ limitTags, options: allOptions, label, disabled, placeholder, onChange, onClose }: IMutiSelectProps) {
  const classes = useStyles();

  const [state, setState] = React.useState<IMutiSelectState>({
    value: [],
    allSelected: false,
  });
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const resetState = () => {
    setState({
      ...state,
      value: [],
      allSelected: false,
    });
  };

  React.useEffect(resetState, [allOptions[2]]);

  return (
    <Box className={classes.multipleSelectBox}>
      <Autocomplete
        classes={{
          tagSizeSmall: classes.tagSizeSmall,
        }}
        disabled={disabled}
        size="small"
        multiple
        limitTags={limitTags}
        options={allOptions}
        getOptionDisabled={(option) => {
          return state.allSelected;
        }}
        getOptionLabel={(option) => option.label}
        value={state.value}
        onChange={(event, value) => {
          const curAllSelected = value.filter((item) => item.value === "all").length > 0;
          onChange && onChange(value);
          setState({
            ...state,
            value: curAllSelected ? [{ value: "all", label: t("report_label_all") }] : value,
            allSelected: curAllSelected,
          });
        }}
        renderOption={(option, { selected }) => {
          return (
            !(option.value === "all" && state.allSelected) && (
              <>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 4 }} checked={selected} />
                {option.label}
              </>
            )
          );
        }}
        renderInput={(params) => (
          <TextField {...params} variant="outlined" label={label} placeholder={placeholder} onBlur={onClose ? onClose : () => {}} />
        )}
      />
    </Box>
  );
}

export default function ({ onChange, onClose }: IProps) {
  const classes = useStyles();
  const [state, setState] = React.useState<IState>({
    schoolId: "",
    classes: [],
  });

  const { studentUsage } = useSelector<RootState, RootState["report"]>((state) => state.report);

  const options = React.useMemo<IOptions>(() => {
    const schoolOptions =
      (studentUsage.schoolList.map((item) => ({
        value: item.school_id,
        label: item.school_name,
      })) as ISelect[]) || [];
    const classOptions =
      (studentUsage.schoolList
        .filter((item) => item.school_id === state.schoolId)[0]
        ?.classes?.map((item) => ({
          value: item?.class_id,
          label: item?.class_name,
        })) as ISelect[]) || [];
    return [schoolOptions, classOptions];
  }, [studentUsage.schoolList, state.schoolId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      schoolId: event.target.value,
      classes: [],
    });
  };
  return (
    <Box className={classes.schoolContainer}>
      <Box className={classes.schoolBox}>
        <TextField
          fullWidth
          size="small"
          select
          disabled={options[0].length === 0}
          label={t("report_filter_school")}
          value={state.schoolId}
          onChange={handleChange}
        >
          {options[0].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <MutiSelect
        options={[{ value: "all", label: t("report_label_all") }].concat(options[1])}
        limitTags={2}
        label={t("report_filter_class")}
        onChange={onChange}
        onClose={onClose}
      />
    </Box>
  );
}

export { MutiSelect };
