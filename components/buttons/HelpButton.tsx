import React, { useContext } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../themes/mui_theme";
import { HelpDrawerContext } from "../../contexts/HelpDrawerContextProvider";

function HelpButton() {
  const drawerContext = useContext(HelpDrawerContext);
  return (
    <ThemeProvider theme={theme}>
      <Button
        variant="text"
        color="help_icon"
        size="medium"
        startIcon={
          <Image
            src="/icons_svg/help_icon.svg"
            alt="help_icon"
            height={16}
            width={16}
          />
        }
        style={{ textTransform: "none" }}
        onClick={drawerContext.toggleDrawer("right", true)}
      >
        Help
      </Button>
    </ThemeProvider>
  );
}

export default HelpButton;
