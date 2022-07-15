import { LinearProgress, TableSortLabel } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import clsx from "clsx";
import React from "react";
import { PLTableHeaderProps } from "./PLTableTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableRow: {
      background: "#F3F3F3",
    },
    tableProgress: {
      "& th": { padding: "0" },
    },
  })
);

export function PLTableHeader(props: PLTableHeaderProps) {
  const { emitSort, fields, sortField, loading, className, style } = props;
  const classes = useStyles();

  /** 关于字段排序 **/
  const sortHandler = (fieldID: string) => (event: React.MouseEvent<unknown>) => {
    emitSort && emitSort(fieldID, event);
  };

  return (
    <TableHead>
      <TableRow className={clsx(classes.tableRow, className)} style={style}>
        {fields.map(
          (field) =>
            !field.hidden && (
              <TableCell
                key={field.value}
                align={field.align}
                width={field.width}
                hidden={field.hidden}
                style={field.style}
                className={field.className}
              >
                {field.sortable ? (
                  <TableSortLabel
                    key={field.value}
                    active={sortField === field.value && !!field.sortType}
                    direction={field.sortType}
                    onClick={sortHandler(field.value)}
                  >
                    {field.text}
                  </TableSortLabel>
                ) : (
                  field.text
                )}
              </TableCell>
            )
        )}
      </TableRow>
      {loading && (
        <tr className={classes.tableProgress}>
          <th colSpan={fields.filter((i) => !i.hidden).length}>
            <LinearProgress />
          </th>
        </tr>
      )}
    </TableHead>
  );
}
