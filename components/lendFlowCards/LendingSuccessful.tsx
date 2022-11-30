import Image from "next/image";
import React, { useState } from "react";
import styles from "../../styles/componentStyles/lendFlowCards/lendingSuccessful.module.css";
import AddToWallet from "../buttons/AddToWallet";
import ProceedButton from "../buttons/ProceedButton";
function LendingSuccessful() {
  const [addedToWallet, setAddedToWallet] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.container_top}>
        <Image
          src="/icons_svg/check_green.svg"
          alt="green_check"
          height={100}
          width={100}
        />
        <span className={styles.container_top_title}>Awesome!</span>
        <span className={styles.container_top_subtitle}>You lent 100 ETH</span>
        <div className={styles.lending_receipt_container}>
          <Image
            src="/icons_svg/tokens/eth_icon.svg"
            alt="eth_icon"
            height={32}
            width={32}
          />
          <div className={styles.lending_receipt_container__details}>
            <span className={styles.lending_receipt_container__details__title}>
              You received 100 Aave ETH (aETH)
            </span>
            <span
              className={styles.lending_receipt_container__details__subtitle}
            >
              Atokens are It’s a representation of the asset you lent to track
              your balance
            </span>
            {!addedToWallet && (
              <AddToWallet
                clickHandle={() => {
                  setAddedToWallet(true);
                }}
                buttonText={"Add to wallet"}
              />
            )}
            {addedToWallet && (
              <div
                className={styles.lending_receipt_container__acknowledgement}
              >
                <Image
                  src="/icons_svg/check_green_hollow.svg"
                  alt="green_check"
                  height={12}
                  width={12}
                />
                <span>Added to wallet</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.container_bottom_buttons}>
        <div></div>
        <ProceedButton buttonText={"Done"} nextPath={"/"} />
      </div>
    </div>
  );
}

export default LendingSuccessful;
