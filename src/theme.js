import { createTheme } from "@mui/material/styles";

const baseTheme = {
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontWeightBold: 700,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          textTransform: "none",
          fontWeight: "bold",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          overflow: "hidden",
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.03)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light",
    primary: {
      main: "#e50914", // Netflix red
    },
    background: {
      default: "#fdfbfb",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
    },
  },
  components: {
    ...baseTheme.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(to right, #fdfbfb, #ebedee)",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark",
    primary: {
      main: "#e50914",
    },
    background: {
      default: "#121212",
      paper: "#1f1f1f",
    },
    text: {
      primary: "#ffffff",
    },
  },
});
