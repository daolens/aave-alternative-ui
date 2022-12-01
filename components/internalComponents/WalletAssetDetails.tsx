import React, { MouseEventHandler, ReactNode } from "react";
import styles from "../../styles/componentStyles/internalComponents/walletAssetDetails.module.css";
interface Props {
  tokenName?: string;
  tokenIcon?: ReactNode;
  tokenBalance?: number;
  tokenInterestRate?: string;
  clickHandle?: MouseEventHandler<HTMLDivElement> | undefined;
}
function WalletAssetDetails({
  tokenName,
  tokenIcon,
  tokenBalance,
  tokenInterestRate,
  clickHandle,
}: Props) {
  return (
    <div className={styles.container} onClick={clickHandle}>
      <div className={styles.container_top}>
        {tokenIcon} <span>{tokenName}</span>
      </div>
      <div className={styles.container_bottom}>
        <span>Wallet balance: {tokenBalance}</span>
        <span>Interest rate: {tokenInterestRate}</span>
      </div>
    </div>
  );
}

export default WalletAssetDetails;
