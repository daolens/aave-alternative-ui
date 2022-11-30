import React from "react";
import styles from "../../styles/componentStyles/buttons/buttons.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
interface Props {
  buttonText?: String;
}

function BackButton({ buttonText }: Props) {
  const router = useRouter();
  return (
    <div
      className={styles.back_container}
      onClick={() => {
        router.back();
      }}
    >
      <Image
        src="/icons_svg/back_icon.svg"
        alt="back_btn"
        height={12}
        width={12}
      />
      <span>{buttonText}</span>
    </div>
  );
}

export default BackButton;
