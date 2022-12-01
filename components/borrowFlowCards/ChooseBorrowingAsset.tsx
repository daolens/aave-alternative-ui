import React, { useEffect, useState } from "react";
import FlowLayout from "../../layouts/FlowLayout";
import styles from "../../styles/componentStyles/lendFlowCards/chooseLendingAsset.module.css";
import walletAssetData from "../../store/staticData/walletAssetDetails.json";
import borrowingAssetData from "../../store/staticData/borrowingAssetDetails.json";
import WalletAssetDetails from "../internalComponents/WalletAssetDetails";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import AssetAmountSelection from "../borrowFlowCards/AssetAmountSelection";
import { SelectChangeEvent } from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { emptyObject } from "src/helpers/types";
import {
  ComputedReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "src/hooks/app-data-provider/useWalletBalances";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { USD_DECIMALS, valueToBigNumber } from "@aave/math-utils";
import BigNumber from "bignumber.js";
import { API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import { shortenNumber } from "src/helpers/shortenStrings";
interface assetData {
  id?: string;
  name?: string;
  balance?: number;
  interest_rate?: string;
  icon_slug?: string;
}
function ChooseBorrowingAsset() {
  // ! Regex
  const decimalNumberRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9])/;
  // ! Contexts
  const { reserves, marketReferencePriceInUsd, user } = useAppDataContext();
  const { walletBalances } = useWalletBalances();
  const { currentNetworkConfig, currentChainId } = useProtocolDataContext();
  const {
    bridge,
    isTestnet,
    baseAssetSymbol,
    name: networkName,
    networkLogoPath,
  } = currentNetworkConfig;
  // ! Local states
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [currentAssetDetails, setcurrentAssetDetails] = useState(
    {} as emptyObject
  );
  const [availableReserves, setAvailableReserves] = useState([]);
  const [supplyReserves, setSupplyReserves] = useState([]);
  // ! Effects
  useEffect(() => {
    if (selectedAsset) {
      const found = borrowingAssetData.find(
        (singleAsset) => singleAsset.id == selectedAsset
      );
      if (found) setcurrentAssetDetails(found);
      else setcurrentAssetDetails({});
      //   if (found) return found;
    }
  }, [selectedAsset]);
  useEffect(() => {
    const tokensToSupply = reserves
      .filter((reserve: ComputedReserveData) => !reserve.isFrozen)
      .map((reserve: ComputedReserveData) => {
        const walletBalance = walletBalances[reserve.underlyingAsset]?.amount;
        const walletBalanceUSD =
          walletBalances[reserve.underlyingAsset]?.amountUSD;
        let availableToDeposit = valueToBigNumber(walletBalance);
        if (reserve.supplyCap !== "0") {
          availableToDeposit = BigNumber.min(
            availableToDeposit,
            new BigNumber(reserve.supplyCap)
              .minus(reserve.totalLiquidity)
              .multipliedBy("0.995")
          );
        }
        const availableToDepositUSD = valueToBigNumber(availableToDeposit)
          .multipliedBy(reserve.priceInMarketReferenceCurrency)
          .multipliedBy(marketReferencePriceInUsd)
          .shiftedBy(-USD_DECIMALS)
          .toString();

        const isIsolated = reserve.isIsolated;
        const hasDifferentCollateral = user?.userReservesData.find(
          (userRes) =>
            userRes.usageAsCollateralEnabledOnUser &&
            userRes.reserve.id !== reserve.id
        );

        const usageAsCollateralEnabledOnUser = !user?.isInIsolationMode
          ? reserve.usageAsCollateralEnabled &&
            (!isIsolated || (isIsolated && !hasDifferentCollateral))
          : !isIsolated
          ? false
          : !hasDifferentCollateral;

        if (reserve.isWrappedBaseAsset) {
          let baseAvailableToDeposit = valueToBigNumber(
            walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount
          );
          if (reserve.supplyCap !== "0") {
            baseAvailableToDeposit = BigNumber.min(
              baseAvailableToDeposit,
              new BigNumber(reserve.supplyCap)
                .minus(reserve.totalLiquidity)
                .multipliedBy("0.995")
            );
          }
          const baseAvailableToDepositUSD = valueToBigNumber(
            baseAvailableToDeposit
          )
            .multipliedBy(reserve.priceInMarketReferenceCurrency)
            .multipliedBy(marketReferencePriceInUsd)
            .shiftedBy(-USD_DECIMALS)
            .toString();
          return [
            {
              ...reserve,
              reserve,
              underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              ...fetchIconSymbolAndName({
                symbol: baseAssetSymbol,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              }),
              walletBalance:
                walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount,
              walletBalanceUSD:
                walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD,
              availableToDeposit: baseAvailableToDeposit.toString(),
              availableToDepositUSD: baseAvailableToDepositUSD,
              usageAsCollateralEnabledOnUser,
              detailsAddress: reserve.underlyingAsset,
              id: reserve.id + "base",
            },
            {
              ...reserve,
              reserve,
              walletBalance,
              walletBalanceUSD,
              availableToDeposit:
                availableToDeposit.toNumber() <= 0
                  ? "0"
                  : availableToDeposit.toString(),
              availableToDepositUSD:
                Number(availableToDepositUSD) <= 0
                  ? "0"
                  : availableToDepositUSD.toString(),
              usageAsCollateralEnabledOnUser,
              detailsAddress: reserve.underlyingAsset,
            },
          ];
        }

        return {
          ...reserve,
          reserve,
          walletBalance,
          walletBalanceUSD,
          availableToDeposit:
            availableToDeposit.toNumber() <= 0
              ? "0"
              : availableToDeposit.toString(),
          availableToDepositUSD:
            Number(availableToDepositUSD) <= 0
              ? "0"
              : availableToDepositUSD.toString(),
          usageAsCollateralEnabledOnUser,
          detailsAddress: reserve.underlyingAsset,
        };
      })
      .flat();
    const sortedSupplyReserves = tokensToSupply.sort((a, b) =>
      +a.walletBalanceUSD > +b.walletBalanceUSD ? -1 : 1
    );
    const filteredSupplyReserves = sortedSupplyReserves.filter(
      (reserve) => reserve.availableToDepositUSD !== "0"
    );
    setAvailableReserves(sortedSupplyReserves as any);
    setSupplyReserves(filteredSupplyReserves as any);
  }, [reserves]);

  // ! Local handlers
  const handleAssetChange = (event: SelectChangeEvent) => {
    setMaxBalance(0);
    setSelectedAsset(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.value", event.target.value);
    // if (decimalNumberRegex.test(event.target.value))
    setSelectedAmount(+event.target.value);
  };
  const setMaxBalance = (balance: number) => {
    setSelectedAmount(balance);
  };
  //   const fetchBalance = (assetId: string) => {
  //     let found = walletAssetData.find(
  //       (singleAsset) => singleAsset.id == assetId
  //     );
  //     if (found) return found.balance;
  //     return 0;
  //   };
 const fetchYearlyEarnings = () => {
    const interest_rate = currentAssetDetails.supplyAPY;
    if (Number(interest_rate))
      return shortenNumber(selectedAmount * Number(interest_rate));
    return 0;
  };
  return (
    <div className={styles.container}>
      <FlowLayout
        sectionTitle={
          selectedAsset ? "Select borrowing amount" : "Select borrowing asset"
        }
        title={
          selectedAsset ? (
            <>
              Enter the amount you want to borrow, don’t worry you can repay
              anytime 😊
            </>
          ) : (
            <>Let’s now choose the asset you want to borrow</>
          )
        }
        proceedButtonText="Borrow"
        nextPath="/borrow/success"
      >
        <AssetAmountSelection
          selectedAmount={selectedAmount}
          selectedAsset={selectedAsset}
          updateAsset={handleAssetChange}
          updateAmount={handleAmountChange}
          availableReserves={availableReserves}
        />
        {selectedAsset && (
          <Divider
            sx={{
              color: "#A5A8B6",
              margin: "20px 0",
              "&::after": { borderTop: "thin dotted #3F424F" },
              "&::before": { borderTop: "thin dotted #3F424F" },
            }}
          >
            OR
          </Divider>
        )}
        {selectedAsset ? (
          <div className={styles.selected_asset_details}>
            <div className={styles.selected_asset_details__container}>
              <span>People invested</span>
              <span>
                <AvatarGroup
                  max={4}
                  sx={{ ">div": { width: 20, height: 20, fontSize: "10px" } }}
                >
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  <Avatar
                    alt="Travis Howard"
                    src="/static/images/avatar/2.jpg"
                  />
                  <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                  <Avatar
                    alt="Agnes Walker"
                    src="/static/images/avatar/4.jpg"
                  />
                  <Avatar
                    alt="Trevor Henderson"
                    src="/static/images/avatar/5.jpg"
                  />
                </AvatarGroup>
              </span>
            </div>
            <div className={styles.selected_asset_details__container}>
              <span>Annual interest rate</span>
              <span style={{ fontSize: "24px", color: "#31C48D" }}>
                {currentAssetDetails.interest_rate}
              </span>
            </div>
            <div className={styles.selected_asset_details__container}>
              <span>Credit health score</span>
              <span style={{ fontSize: "24px", color: "#31C48D" }}>
                {fetchYearlyEarnings()}
              </span>
            </div>
          </div>
        ) : null}
      </FlowLayout>
    </div>
  );
}

export default ChooseBorrowingAsset;
