import { API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Base64Token } from "src/components/primitives/TokenIcon";
import {
  ComputedReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { ERC20TokenType } from "src/libs/web3-data-provider/Web3Provider";
import styles from "../../styles/componentStyles/lendFlowCards/lendingSuccessful.module.css";
import AddToWallet from "../buttons/AddToWallet";
import ProceedButton from "../buttons/ProceedButton";
function BorrowingSuccessful() {
  const router = useRouter();
  const { underlyingAsset, amount } = router.query as {
    underlyingAsset: string;
    amount: string;
  };
  const { reserves } = useAppDataContext();
  const [addedToWallet, setAddedToWallet] = useState(false);
  const [base64, setBase64] = useState("");
  const [addToken, setaddToken] = useState({} as ERC20TokenType);
  const { addERC20Token } = useWeb3Context();
  const poolReserve = reserves.find((reserve) => {
    if (underlyingAsset?.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return reserve.isWrappedBaseAsset;
    return underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;
  useEffect(() => {
    if (poolReserve)
      setaddToken({
        address: underlyingAsset,
        symbol: poolReserve.iconSymbol,
        decimals: poolReserve.decimals,
      });
  }, [poolReserve]);
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
        <span className={styles.container_top_subtitle}>
          You borrowed {amount} {poolReserve?.name}{" "}
          {addToken?.symbol && !/_/.test(addToken.symbol) && (
            <Base64Token
              symbol={addToken.symbol}
              onImageGenerated={setBase64}
              aToken={addToken.aToken}
            />
          )}
        </span>
        <div className={styles.lending_receipt_container}>
          <Image
            src={
              poolReserve
                ? `/icons/tokens/${poolReserve.iconSymbol.toLowerCase()}.svg`
                : "/icons_svg/tokens/eth_icon.svg"
            }
            alt="eth_icon"
            height={32}
            width={32}
          />
          <div className={styles.lending_receipt_container__details}>
            <span className={styles.lending_receipt_container__details__title}>
              Add token to wallet to track your balance.
            </span>
            <span
              className={styles.lending_receipt_container__details__subtitle}
            >
              The tokens you borrowed can be added to your wallet so that you
              can track the balance.
            </span>
            {!addedToWallet && (
              <AddToWallet
                clickHandle={() => {
                  setAddedToWallet(true);
                  addERC20Token({
                    address: addToken.address,
                    decimals: addToken.decimals,
                    symbol: addToken.aToken
                      ? `a${addToken.symbol}`
                      : addToken.symbol,
                    image: !/_/.test(addToken.symbol) ? base64 : undefined,
                  });
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

export default BorrowingSuccessful;
