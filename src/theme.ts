import { createTheme, adaptV4Theme } from "@mui/material";

export default createTheme(
  adaptV4Theme({
    palette: {
      primary: {
        main: "#0E78D5",
      },
      secondary: {
        main: "#9C27B0",
      },
      error: {
        main: "#D32F2F",
      },
      success: {
        main: "#4CAF50",
      },
      warning: {
        main: "#FFC107",
      },
    },
    typography: {
      button: {
        textTransform: "none",
      },
    },
    props: {
      MuiTextField: {
        variant: "outlined",
      },
    },
    overrides: {
      MuiFormLabel: {
        asterisk: {
          color: "#D32F2F",
        },
      },
    },
  })
);
