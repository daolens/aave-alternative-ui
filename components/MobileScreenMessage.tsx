import Image from "next/image";
import React from "react";
import styles from "../styles/componentStyles/mobileScreenMessage.module.css";
import CustomBoxComponent from "./wrappers/CustomBoxComponent";
function MobileScreenMessage() {
  return (
    <div className={styles.container}>
      <CustomBoxComponent>
        <div className={styles.container_top}>
          <Image
            src="/icons_svg/aave_mascot.svg"
            alt="aave_amscot"
            height={162}
            width={135}
          />
          <p className={styles.container_top__typography}>
            Hey, this site is best viewed
            <br />
            on a desktop or a laptop
          </p>

          {/* <ConnectWallet buttonText={"Connect Wallet"} /> */}
        </div>
      </CustomBoxComponent>
    </div>
  );
}

export default MobileScreenMessage;
