import React, { MouseEventHandler, useState } from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useWalletModalContext } from "src/hooks/useWalletModal";
import { WalletModal } from "src/components/WalletConnection/WalletModal";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { textCenterEllipsis } from "src/helpers/text-center-ellipsis";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { Typography } from "@mui/material";
interface Props {
  buttonText?: string;
}
function ConnectWallet({ buttonText }: Props) {
  // ! Hooks
  const router = useRouter();
  // ! Local states
  const [showDrowpdown, setShowDrowpdown] = useState(false);
  // ! Contexts
  const { setWalletModalOpen } = useWalletModalContext();
  const { connected, currentAccount, disconnectWallet } = useWeb3Context();
  const { currentNetworkConfig } = useProtocolDataContext();
  const handleSwitchWallet = (): void => {
    setWalletModalOpen(true);
    setShowDrowpdown(false);
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={
          connected
            ? () => {
                setShowDrowpdown(!showDrowpdown);
                // disconnectWallet();
              }
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
          position: "relative",
          color: "#ffffff",
        }}
      >
        {connected ? textCenterEllipsis(currentAccount, 6, 6) : buttonText}
        {connected && (
          <Image
            src="/icons_svg/down_icon_drowpdown.svg"
            alt="wallet_icon"
            height={12}
            width={12}
            style={{ marginLeft: "5px" }}
          />
        )}
        {showDrowpdown && (
          <div
            style={{
              position: "absolute",
              color: "#ffffff",
              bottom: "-255%",
              width: "100%",
              borderRadius: "4px",
              backgroundColor: "#2A2E3F",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Button
              centerRipple={true}
              sx={{ width: "100%", "&:hover": { backgroundColor: "#2D3347" } }}
              onClick={handleSwitchWallet}
            >
              <Image
                src="/icons_svg/wallet_icon.svg"
                alt="wallet_icon"
                height={15}
                width={15}
                style={{ marginRight: "5px" }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  padding: "8px 5px",
                  color: "#ffffff",
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "8px",
                }}
              >
                Switch wallet
              </Typography>
            </Button>

            <Button
              centerRipple={true}
              sx={{ width: "100%", "&:hover": { backgroundColor: "#2D3347" } }}
              onClick={disconnectWallet}
            >
              <Image
                src="/icons_svg/simple_cross.svg"
                alt="wallet_icon"
                height={12}
                width={12}
                style={{ marginRight: "5px" }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  padding: "8px 5px",
                  color: "#ffffff",
                  width: "100%",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "8px",
                }}
              >
                Disconnect wallet
              </Typography>
            </Button>
          </div>
        )}
      </Button>
      <WalletModal />
    </>
  );
}

export default ConnectWallet;
