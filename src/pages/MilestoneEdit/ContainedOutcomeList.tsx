import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { RemoveCircle } from "@material-ui/icons";
import React, { useMemo } from "react";
import { GetOutcomeDetail, GetOutcomeList, MilestoneDetailResult } from "../../api/type";
import { d } from "../../locale/LocaleManager";
const createColor = (paletteColor: PaletteColor, palette: Palette) => ({
  color: paletteColor.main,
  cursor: "pointer",
  "&:hover": {
    color: paletteColor.dark,
  },
});
const useStyles = makeStyles(({ breakpoints, palette }) => ({
  tableContainer: {
    marginTop: 5,
    maxHeight: 900,
    marginBottom: 20,
  },
  table: {
    minWidth: 700 - 162,
  },
  tableHead: {
    backgroundColor: "#F2F5F7",
    textAlign: "center",
  },
  tableCell: {
    maxWidth: 200,
    textAlign: "center",
  },
  liCon: {
    textAlign: "left",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    listStylePosition: "inside",
  },
  addGreen: createColor(palette.success, palette),
  removeRead: createColor(palette.error, palette),
}));
export interface ContainedOutcomeListProps {
  outcomeList: GetOutcomeList;
  value: MilestoneDetailResult["outcome_ancestor_ids"];
  addOrRemoveOutcome: (outcome: GetOutcomeDetail, type: "add" | "remove") => any;
  canEdit: boolean;
}
export default function ContainedOutcomeList(props: ContainedOutcomeListProps) {
  const css = useStyles();
  const { outcomeList, value, canEdit, addOrRemoveOutcome } = props;
  const containedOutcomeList = useMemo(() => {
    if (value && value[0]) {
      return outcomeList.filter((outcome) => value.indexOf(outcome.ancestor_id as string) >= 0);
    }
  }, [outcomeList, value]);

  const rows =
    containedOutcomeList &&
    containedOutcomeList[0] &&
    containedOutcomeList.map((item) => (
      <TableRow key={item.outcome_id}>
        <TableCell className={css.tableCell}>{item.outcome_name}</TableCell>
        <TableCell className={css.tableCell}>{item.shortcode}</TableCell>
        <TableCell className={css.tableCell}>{item.program && item.program[0] ? item.program[0].program_id : ""}</TableCell>
        <TableCell className={css.tableCell}>{item.developmental?.map((v) => v.developmental_name).join(",")}</TableCell>
        <TableCell className={css.tableCell}>{item.assumed ? "Yes" : ""}</TableCell>
        <TableCell className={css.tableCell}>
          <ul>
            {item.sets?.map((item, index) => (
              <li className={css.liCon} key={`${index}${item.set_name}`}>
                {item.set_name}
              </li>
            ))}
          </ul>
        </TableCell>
        <TableCell className={css.tableCell}>
          {/* <AddCircle className={css.addGreen} /> */}
          {!canEdit && <RemoveCircle className={css.removeRead} onClick={() => addOrRemoveOutcome(item, "remove")} />}
        </TableCell>
      </TableRow>
    ));
  return (
    <>
      <h1>{d("Contained Learning Outcomes").t("assess_milestone_contained_lo")}</h1>
      <TableContainer className={css.tableContainer}>
        <Table className={css.table} stickyHeader>
          <TableHead className={css.tableHead}>
            <TableRow>
              <TableCell className={css.tableCell}>{d("Learning Outcomes").t("library_label_learning_outcomes")}</TableCell>
              <TableCell className={css.tableCell}>{d("Short Code").t("assess_label_short_code")}</TableCell>
              <TableCell className={css.tableCell}>{d("Program").t("assess_column_program")}</TableCell>
              <TableCell className={css.tableCell}>{d("Category").t("assess_label_category")}</TableCell>
              <TableCell className={css.tableCell}>{d("Assumed").t("assess_label_assumed")}</TableCell>
              <TableCell className={css.tableCell}>{d("Learning Outcome Set").t("assess_set_learning_outcome_set")}</TableCell>
              <TableCell className={css.tableCell}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
}