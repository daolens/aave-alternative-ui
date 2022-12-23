import React, { MouseEventHandler, ReactNode, useContext } from "react";
import HelpButton from "../components/buttons/HelpButton";
import styles from "../styles/layoutStyles/flowLayout.module.css";
import theme from "../themes/mui_theme";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Image from "next/image";
import BackButton from "../components/buttons/BackButton";
import ProceedButton from "../components/buttons/ProceedButton";
import { HelpDrawerContext } from "contexts/HelpDrawerContextProvider";
interface Props {
  children?: ReactNode;
  sectionTitle?: string;
  title?: ReactNode;
  proceedButtonText?: string;
  nextPath?: string;
  clickHandle?: MouseEventHandler<HTMLDivElement> | undefined;
  isLoading?: boolean;
  tooltipText?: string;
}
function FlowLayout({
  children,
  sectionTitle,
  title,
  proceedButtonText,
  nextPath,
  clickHandle,
  isLoading,
  tooltipText,
}: Props) {
  const drawerContext = useContext(HelpDrawerContext);
  return (
    <div className={styles.container}>
      <div className={styles.container_children}>
        <div className={styles.container_children__top}>
          <Image
            src="/icons_svg/aave_mascot.svg"
            alt="aave_amscot"
            height={32}
            width={32}
          />
          <span
            style={{ cursor: "pointer" }}
            onClick={drawerContext.toggleDrawer("right", true) as any}
          >
            {sectionTitle}
          </span>
        </div>
        <h1 className={styles.container_children__title}>{title}</h1>
        {children}
      </div>

      <div
        className={
          proceedButtonText
            ? styles.container_bottom_buttons
            : styles.container_bottom
        }
      >
        {proceedButtonText ? (
          <>
            <BackButton buttonText={"Back"} />
            <ProceedButton
              buttonText={proceedButtonText}
              nextPath={nextPath}
              clickHandle={clickHandle}
              isLoading={isLoading}
              tooltipText={tooltipText}
            />
          </>
        ) : (
          <>
            <HelpButton />
            {/* <ThemeProvider theme={theme}>
              <Button
                color={"link_button_color" as any}
                sx={{ textTransform: "none" }}
                variant="text"
                onClick={drawerContext.toggleDrawer("right", true) as any}
              >
                What is Aave?
              </Button>
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <Button
                color={"link_button_color" as any}
                sx={{ textTransform: "none" }}
                variant="text"
                onClick={drawerContext.toggleDrawer("right", true) as any}
              >
                What’s a wallet? Help me setup
              </Button>
            </ThemeProvider> */}
          </>
        )}
      </div>
    </div>
  );
}

export default FlowLayout;
