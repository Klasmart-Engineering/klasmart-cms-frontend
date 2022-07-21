import { createTheme } from "@mui/material";

export default createTheme({
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
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: "#D32F2F",
        },
      },
    },
  },
});
