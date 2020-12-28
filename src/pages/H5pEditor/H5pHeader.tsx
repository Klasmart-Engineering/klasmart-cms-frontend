import { Button, Grid, IconButton, InputBase, makeStyles, Paper, Typography } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles(() => ({
  header_container: {
    borderBottom: "1px solid #eee",
    paddingBottom: "20px",
  },
  selectButton: {
    cursor: "pointer",
    border: "1px solid transparent",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  box_selected: {
    marginTop: "10px",
  },
  activeLink: {
    textDecoration: "underline",
    border: "1px solid #1a93f4",
    fontWeight: 700,
  },
  searchBox: {
    width: "25%",
    padding: "5px 20px 5px 20px",
    // paddingLeft: '20px',
    marginTop: "20px",
    border: "2px solid #eee",
    boxShadow: "none",
    borderRadius: "20px",
    position: "relative",
  },
  searchInput: {
    width: "85%",
    fontSize: "20px",
  },
  searchButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
  },
}));

export default function H5pHeader() {
  const [activeOption, setActiveOption] = React.useState("popularFirst");

  const css = useStyles();

  const handleSelect = (type: string) => {
    setActiveOption(type);
  };

  return (
    <div className={css.header_container}>
      <Grid container>
        <Paper className={css.searchBox}>
          <InputBase
            placeholder="Search for Content Types"
            inputProps={{ "aria-label": "search for Content Types" }}
            className={css.searchInput}
          />
          <IconButton className={css.searchButton} type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Grid>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h6">All Content Types</Typography>
        </Grid>
        <Grid item>(45 results)</Grid>
      </Grid>
      <Grid container spacing={5} alignItems="center" className={css.box_selected}>
        <Grid item>show: </Grid>
        <Grid item>
          <Button
            className={clsx(css.selectButton, activeOption === "popularFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("popularFirst")}
          >
            Popular First
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={clsx(css.selectButton, activeOption === "NewestFirst" ? css.activeLink : "")}
            onClick={() => handleSelect("NewestFirst")}
          >
            Newest First
          </Button>
        </Grid>
        <Grid item>
          <Button className={clsx(css.selectButton, activeOption === "aToZ" ? css.activeLink : "")} onClick={() => handleSelect("aToZ")}>
            A to Z
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
