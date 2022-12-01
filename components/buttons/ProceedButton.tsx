import React from "react";
import styles from "../../styles/componentStyles/buttons/buttons.module.css";

import { useRouter } from "next/router";
import Image from "next/image";
interface Props {
  buttonText?: string;
  nextPath: string;
}
function ProceedButton({ buttonText, nextPath }: Props) {
  const router = useRouter();
  return (
    <div
      className={styles.proceed_container}
      onClick={() => {
        router.push(nextPath);
      }}
    >
      <span>{buttonText}</span>
      <Image
        src="/icons_svg/forward_icon.svg"
        alt="proceed_btn"
        height={12}
        width={12}
      />
    </div>
  );
}

export default ProceedButton;
