import { SelectItem } from "@api/extra";
import { Button, FormControl, InputLabel, LinearProgress, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
interface ISelectMore {
  value: string;
  onChange: (value: string) => void;
  label: string;
  list: SelectItem[];
  cursor?: string;
  loading?: boolean;
  getNextPageList?: () => any;
}
export function SelectMore(props: ISelectMore) {
  const { value, onChange, label, list, cursor, loading, getNextPageList } = props;
  const [open, setOpen] = useState(false);
  const handleChange = (value: string) => {
    if (value) {
      onChange(value);
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  return (
    <FormControl size="small" fullWidth variant="outlined">
      <InputLabel variant="outlined">{label}</InputLabel>
      <Select
        fullWidth
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        disabled={!list?.length}
        value={value}
        label={label}
        onChange={(e) => handleChange(e.target.value as string)}
      >
        {list?.map(({ label, value }) => (
          <MenuItem key={`${value}${label}`} value={value}>
            {label}
          </MenuItem>
        ))}
        {cursor && !loading && (
          <Button fullWidth color="primary" onClick={getNextPageList}>
            more...
          </Button>
        )}
        {cursor && loading && <LinearProgress />}
      </Select>
    </FormControl>
  );
}
