import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWalletModalContext } from "src/hooks/useWalletModal";
import { WalletModal } from "src/components/WalletConnection/WalletModal";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { textCenterEllipsis } from "src/helpers/text-center-ellipsis";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
interface Props {
  buttonText?: String;
}
function ConnectWallet({ buttonText }: Props) {
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, disconnectWallet } = useWeb3Context();
  const { currentNetworkConfig } = useProtocolDataContext();
  const router = useRouter();
  return (
    <>
      <Button
        variant="contained"
        onClick={
          connected
            ? () => disconnectWallet()
            : () => setWalletModalOpen(true)
        }
        startIcon={
          !connected ? (
            <Image
              src="/icons_svg/wallet_icon.svg"
              alt="wallet_icon"
              height={20}
              width={20}
            />
          ) : (
            <Image
              src={currentNetworkConfig.networkLogoPath}
              alt="wallet_icon"
              height={20}
              width={20}
            />
          )
        }
        style={{
          background: connected
            ? "#3F424F"
            : "linear-gradient(55.94deg, #30BAC6 -29.83%, #9A4386 62.81%)",
          textTransform: "none",
        }}
      >
        {connected ? textCenterEllipsis(currentAccount, 4, 4) : buttonText}
      </Button>
      <WalletModal />
    </>
  );
}

export default ConnectWallet;
