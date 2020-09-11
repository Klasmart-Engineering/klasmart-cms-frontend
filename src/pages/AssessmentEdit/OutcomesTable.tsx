import {
  Box,
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { Controller, UseFormMethods } from "react-hook-form";
import { GetAssessmentResultOutcomeAttendanceMap } from "../../api/type";
import { CheckboxGroup } from "../../components/CheckboxGroup";
import { AssessmentState } from "../../reducers/assessment";

const useStyles = makeStyles({
  tableContainer: {
    marginTop: 5,
    maxHeight: 830,
    marginBottom: 20,
  },
  table: {
    minWidth: 900,
    fontSize: "14px !important",
  },
  checkBoxUi: {
    fontSize: "14px !important",
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
  },
  tableCellLine: {
    "&:not(:last-child)": {
      borderRight: "1px solid #ebebeb",
    },
  },
  assessActionline: {
    borderLeft: "1px solid #ebebeb",
  },
});

interface AssessActionProps {
  outcome: GetAssessmentResultOutcomeAttendanceMap;
  attendenceList: AssessmentState["assessmentDetail"]["attendances"];
  formMethods: UseFormMethods<AssessmentState["assessmentDetail"]>;
  index: number;
}
const AssessAction = (props: AssessActionProps) => {
  const css = useStyles();
  const {
    outcome: { outcome_id, attendance_ids, skip },
    formMethods: { control, setValue },
    index,
    attendenceList,
  } = props;

  const allValue = useMemo(() => attendenceList?.map((item) => item.id as string), [attendenceList]);
  const handleChangeSkip: CheckboxProps["onChange"] = (e) => {
    const skip = e.target.checked;
    if (skip) {
      setValue(`outcome_attendance_maps[${index}].attendance_ids`, []);
      setValue(`outcome_attendance_maps[${index}].skip`, true);
    } else {
      setValue(`outcome_attendance_maps[${index}].skip`, false);
    }
  };
  return (
    <Controller
      name={`outcome_attendance_maps[${index}].attendance_ids`}
      control={control}
      defaultValue={attendance_ids || []}
      render={(props) => (
        <CheckboxGroup
          allValue={allValue}
          {...props}
          render={(selectedContentGroupContext) => (
            <Box display="flex" alignItems="center">
              <Box width={300} fontSize={14}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedContentGroupContext.isAllvalue || false}
                      onChange={selectedContentGroupContext.registerAllChange}
                      name="award"
                      color="primary"
                    />
                  }
                  label="Award All"
                  disabled={skip}
                />
                {/* <FormControlLabel
                  control={<Checkbox onChange={handleChangeSkip} defaultChecked={skip || false} color="primary" />}
                  label="Skip"
                /> */}
                <Controller
                  name={`outcome_attendance_maps[${index}].skip`}
                  defaultValue={skip || false}
                  render={(props) => (
                    <FormControlLabel
                      control={<Checkbox checked={props.value} onChange={handleChangeSkip} color="primary" />}
                      label="Skip"
                    />
                  )}
                  control={control}
                />
              </Box>
              <Box px={3} className={css.assessActionline}>
                {attendenceList &&
                  attendenceList.map((item) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          value={item.id}
                          checked={selectedContentGroupContext.hashValue[item.id as string] || false}
                          onChange={selectedContentGroupContext.registerChange}
                        />
                      }
                      label={item.name}
                      key={item.id}
                      disabled={skip}
                    />
                  ))}
                <Controller
                  as={TextField}
                  control={control}
                  disabled
                  name={`outcome_attendance_maps[${index}].outcome_id`}
                  defaultValue={outcome_id}
                  style={{ display: "none" }}
                />
              </Box>
            </Box>
          )}
        />
      )}
    />
  );
};

interface OutcomesTableProps {
  outcomesList: AssessmentState["assessmentDetail"]["outcome_attendance_maps"];
  attendanceList: AssessmentState["assessmentDetail"]["attendances"];
  formMethods: UseFormMethods<AssessmentState["assessmentDetail"]>;
}
export function OutcomesTable(props: OutcomesTableProps) {
  const css = useStyles();
  const { outcomesList, attendanceList, formMethods } = props;
  const rows =
    outcomesList &&
    outcomesList.map((outcome, index) => (
      <TableRow key={outcome.outcome_id}>
        <TableCell className={css.tableCellLine} align="center">
          {outcome.outcome_name}
        </TableCell>
        <TableCell className={css.tableCellLine} align="center">
          {outcome.assumed ? "Yes" : ""}
        </TableCell>
        <TableCell>
          <AssessAction outcome={outcome} attendenceList={attendanceList} formMethods={formMethods} index={index}></AssessAction>
        </TableCell>
      </TableRow>
    ));
  return (
    <TableContainer className={css.tableContainer}>
      <Table className={css.table} stickyHeader>
        <TableHead className={css.tableHead}>
          <TableRow>
            <TableCell width={150} align="center">
              Learning Outcomes
            </TableCell>
            <TableCell width={80} align="center">
              Assumed
            </TableCell>
            <TableCell align="center">Assessing Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    </TableContainer>
  );
}
