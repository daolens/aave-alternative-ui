import React, { MouseEventHandler } from "react";
import styles from "../../styles/componentStyles/buttons/buttons.module.css";

import { useRouter } from "next/router";
import Image from "next/image";
import { useModalContext } from "src/hooks/useModal";
import CircularProgress from "@mui/material/CircularProgress";
interface Props {
  buttonText?: string;
  nextPath?: string;
  clickHandle?: MouseEventHandler<HTMLDivElement> | undefined;
  isLoading?: boolean;
  tooltipText?: string;
}
function ProceedButton({
  buttonText,
  nextPath,
  clickHandle,
  isLoading,
  tooltipText,
}: Props) {
  const router = useRouter();
  // const { mainTxState: supplyTxState } = useModalContext();
  const routeToPath = () => {
    return nextPath ? router.push(nextPath) : null;
  };
  return (
    <div
      className={styles.proceed_container}
      onClick={
        !isLoading
          ? clickHandle || routeToPath
          : () => {
              return;
            }
      }
    >
      <span>{buttonText}</span>
      {isLoading ? (
        <CircularProgress size={18} sx={{ margin: "0px" }} />
      ) : (
        <Image
          src="/icons_svg/forward_icon.svg"
          alt="proceed_btn"
          height={12}
          width={12}
        />
      )}
      {/* <span className={styles.proceed_tooltip}>Loading transactions from your wallet</span> */}
      {isLoading && (
        <span className={styles.proceed_tooltip}>{tooltipText}</span>
      )}
    </div>
  );
}

export default ProceedButton;
