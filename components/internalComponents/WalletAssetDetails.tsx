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
      <div className={styles.container_bottom}>
        <span>
          {balanceTitle}: {parseTokenBalance(tokenBalance)}
        </span>
        <span>Interest rate: {tokenInterestRate}</span>
      </div>
    </div>
  );
}

export default WalletAssetDetails;
