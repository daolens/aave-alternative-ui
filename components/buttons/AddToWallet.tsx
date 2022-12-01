import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
interface Props {
  buttonText?: String;
  clickHandle?: Function;
}
function AddToWallet({ buttonText, clickHandle }: Props) {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      onClick={() => {
        clickHandle?.();
      }}
      startIcon={
        <Image
          src="/icons_svg/wallet_icon_color.svg"
          alt="wallet_icon"
          height={20}
          width={20}
        />
      }
      style={{
        background: "#ffffff",
        textTransform: "none",
      }}
    >
      <span
        style={{
          background:
            "linear-gradient(55.61deg, #30BAC6 -0.35%, #B6509E 92.67%);",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
          fontWeight: "600",
        }}
      >
        {buttonText}
      </span>
    </Button>
  );
}

export default AddToWallet;
