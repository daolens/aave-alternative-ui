import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
interface Props {
  buttonText?: String;
}
function ConnectWallet({ buttonText }: Props) {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      onClick={() => {
        window.localStorage.setItem("isWalletSet", "true");
        router.push("/");
      }}
      startIcon={
        <Image
          src="/icons_svg/wallet_icon.svg"
          alt="wallet_icon"
          height={20}
          width={20}
        />
      }
      style={{
        background:
          "linear-gradient(55.94deg, #30BAC6 -29.83%, #9A4386 62.81%)",
        textTransform: "none",
      }}
    >
      {buttonText}
    </Button>
  );
}

export default ConnectWallet;
