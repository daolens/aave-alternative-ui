import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import FlowLayout from "../layouts/FlowLayout";
import styles from "../styles/componentStyles/connectWalletScreen.module.css";
import TitleSubtitleCard from "./cards/TitleSubtitleCard";
function FlowSelectionScreen() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <FlowLayout
        sectionTitle="Select Flow"
        title={
          <>
            Hello, Welcome to Aave! ✨<br />
            What do you want to do today?{" "}
          </>
        }
        nextPath={""}
      >
        <TitleSubtitleCard
          title="Earn interest"
          subTitle="Deposit your crypto to the lending pool and earn interest"
          clickHandler={() => {
            router.push("/lend/asset");
          }}
          icon={
            <Image
              src="/icons_svg/increase_icon_green.svg"
              alt="increment_icon"
              height={24}
              width={24}
            />
          }
        />
        <TitleSubtitleCard
          title="Borrow"
          subTitle="Get instant overcollateralized crypto loans for trading"
          clickHandler={() => {
            router.push("/borrow/asset");
          }}
          icon={
            <Image
              src="/icons_svg/decrease_icon_purple.svg"
              alt="decrement_icon"
              height={24}
              width={24}
            />
          }
        />
      </FlowLayout>
    </div>
  );
}

export default FlowSelectionScreen;
