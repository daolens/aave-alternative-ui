import { API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Base64Token } from "src/components/primitives/TokenIcon";
import {
  ComputedReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { ModalContextType, useModalContext } from "src/hooks/useModal";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { ERC20TokenType } from "src/libs/web3-data-provider/Web3Provider";
import styles from "../../styles/componentStyles/lendFlowCards/lendingSuccessful.module.css";
import AddToWallet from "../buttons/AddToWallet";
import ProceedButton from "../buttons/ProceedButton";
function LendingSuccessful() {
  const router = useRouter();
  const { underlyingAsset, amount } = router.query as {
    underlyingAsset: string;
    amount: string;
  };
  // console.log(router.query.underlyingAsset);
  const [addedToWallet, setAddedToWallet] = useState(false);
  const [base64, setBase64] = useState("");
  const [addToken, setaddToken] = useState({} as ERC20TokenType);
  const { addERC20Token } = useWeb3Context();

  const { reserves } = useAppDataContext();

  const poolReserve = reserves.find((reserve) => {
    if (underlyingAsset?.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase())
      return reserve.isWrappedBaseAsset;
    return underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;
  // console.log("poolReserve", poolReserve);
  useEffect(() => {
    if (poolReserve)
      setaddToken({
        address: poolReserve.aTokenAddress,
        symbol: poolReserve.iconSymbol,
        decimals: poolReserve.decimals,
        aToken: true,
      });
  }, [poolReserve]);

  // const addToken: ERC20TokenType = {
  //   address: poolReserve.aTokenAddress,
  //   symbol: poolReserve.iconSymbol,
  //   decimals: poolReserve.decimals,
  //   aToken: true,
  // };

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
          You lent {amount} {poolReserve?.name}{" "}
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
                ? `/icons/tokens/${poolReserve.name.toLowerCase()}.svg`
                : "/icons_svg/tokens/eth_icon.svg"
            }
            alt="eth_icon"
            height={32}
            width={32}
          />
          <div className={styles.lending_receipt_container__details}>
            <span className={styles.lending_receipt_container__details__title}>
              You received Aave ETH (aETH)
            </span>
            <span
              className={styles.lending_receipt_container__details__subtitle}
            >
              Atokens are It’s a representation of the asset you lent to track
              your balance
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

export default LendingSuccessful;
