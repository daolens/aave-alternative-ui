import { useMediaQuery } from "@mui/material";
import React, { MouseEventHandler, ReactNode } from "react";
import styles from "../../styles/componentStyles/internalComponents/walletAssetDetails.module.css";
interface Props {
  tokenName?: string;
  tokenIcon?: ReactNode;
  tokenBalance?: number;
  tokenInterestRate?: string;
  clickHandle?: MouseEventHandler<HTMLDivElement> | undefined;
  balanceTitle?: string;
}
function WalletAssetDetails({
  tokenName,
  tokenIcon,
  tokenBalance,
  tokenInterestRate,
  clickHandle,
  balanceTitle,
}: Props) {
  const matches = useMediaQuery("(max-width:600px)");
  const parseTokenBalance = (balance: any) => {
    if (balance && balance.toString().length > 6)
      return `${balance}`.slice(0, 5);
    return balance;
  };
  return (
    <div className={styles.container} onClick={clickHandle}>
      <div className={styles.container_top}>
        {tokenIcon} <span>{tokenName}</span>
      </div>
      <div
        className={styles.container_bottom}
        style={
          matches ? { flexDirection: "column", alignItems: "flex-start" } : {}
        }
      >
        <span>
          {balanceTitle}: {parseTokenBalance(tokenBalance)}
        </span>
        <span
          style={
            matches
              ? { paddingLeft: "0", marginLeft: "0", borderLeft: "0" }
              : {}
          }
        >
          Interest rate: {tokenInterestRate}
        </span>
      </div>
    </div>
  );
}

export default WalletAssetDetails;
