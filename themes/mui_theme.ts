import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    help_icon: {
      main: "#A5A8B6",
    },
    link_button_color: {
      main: "#8DA2FB",
    },
  },
});
declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: React.CSSProperties["color"];
    };
  }

  interface Palette {
    help_icon: Palette["primary"];
    link_button_color: Palette["primary"];
  }
  interface PaletteOptions {
    help_icon: PaletteOptions["primary"];
    link_button_color: PaletteOptions["primary"];
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties["color"];
    };
  }
}
export default theme;
