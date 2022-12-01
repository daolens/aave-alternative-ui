import Image from "next/image";
import React from "react";
import Button from "@mui/material/Button";
import styles from "../styles/componentStyles/connectWalletScreen.module.css";
import ConnectWallet from "./buttons/ConnectWallet";
import HelpButton from "./buttons/HelpButton";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../themes/mui_theme";
function ConnectWalletScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.container_top}>
        <Image
          src="/icons_svg/aave_mascot.svg"
          alt="aave_amscot"
          height={162}
          width={135}
        />
        <p className={styles.container_top__typography}>
          Hey, connect your wallet to
          <br />
          lend or borrow assets
        </p>
        <ConnectWallet buttonText={"Connect Wallet"} />
      </div>
      <div className={styles.container_bottom}>
        <HelpButton />
        <ThemeProvider theme={theme}>
          <Button
            color={"link_button_color" as any}
            sx={{ textTransform: "none" }}
            variant="text"
          >
            Whats is Aave?
          </Button>
        </ThemeProvider>
        <ThemeProvider theme={theme}>
          <Button
            color={"link_button_color" as any}
            sx={{ textTransform: "none" }}
            variant="text"
          >
            What’s a wallet? Help me setup
          </Button>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default ConnectWalletScreen;
