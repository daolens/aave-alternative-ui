import React, { useEffect, useState } from "react";
import FlowLayout from "../../layouts/FlowLayout";
import styles from "../../styles/componentStyles/lendFlowCards/chooseLendingAsset.module.css";
import walletAssetData from "../../store/staticData/walletAssetDetails.json";
import WalletAssetDetails from "../internalComponents/WalletAssetDetails";
import Image from "next/image";
import Divider from "@mui/material/Divider";
import AssetAmountSelection from "./AssetAmountSelection";
import { SelectChangeEvent } from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "src/hooks/app-data-provider/useWalletBalances";
import { USD_DECIMALS, valueToBigNumber } from "@aave/math-utils";
import BigNumber from "bignumber.js";
import {
  API_ETH_MOCK_ADDRESS,
  EthereumTransactionTypeExtended,
  Pool,
} from "@aave/contract-helpers";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import {
  shortenAPY,
  shortenLongNumber,
  shortenNumber,
} from "src/helpers/shortenStrings";
import { emptyObject } from "src/helpers/types";
import { useRootStore } from "src/store/root";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { useTransactionHandler } from "src/helpers/useTransactionHandler";
import { utils } from "ethers";
import { permitByChainAndToken } from "src/ui-config/permitConfig";
import { useModalContext } from "src/hooks/useModal";
import { TxAction } from "src/ui-config/errorMapping";
import { isEmpty } from "lodash";
import { ColorSwatchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
export enum ErrorType {
  CAP_REACHED,
}
interface assetData {
  id: string;
  name?: string;
  balance?: number;
  interest_rate?: string;
  icon_slug?: string;
}

function ChooseLendingAsset() {
  const router = useRouter();
  // ! Regex ************************************************************************************************************
  const decimalNumberRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9])/;
  // ! Local states ************************************************************************************************************
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedAmount, setSelectedAmount] = useState("");
  const [currentAssetDetails, setcurrentAssetDetails] = useState(
    {} as emptyObject
  );
  const [availableReserves, setAvailableReserves] = useState([]);
  const [supplyReserves, setSupplyReserves] = useState([]);
  // ! Contexts ************************************************************************************************************
  const { reserves, marketReferencePriceInUsd, user } = useAppDataContext();
  const { walletBalances } = useWalletBalances();
  const {
    currentNetworkConfig,
    currentChainId: marketChainId,
    currentMarketData,
    jsonRpcProvider,
  } = useProtocolDataContext();
  const {
    connected,
    currentAccount,
    disconnectWallet,
    chainId: connectedChainId,
    watchModeOnlyAddress,
  } = useWeb3Context();
  const {
    txError,
    retryWithApproval,
    mainTxState: supplyTxState,
    close: clearModalContext,
  } = useModalContext();
  const {
    bridge,
    isTestnet,
    baseAssetSymbol,
    name: networkName,
    networkLogoPath,
  } = currentNetworkConfig;
  const supply = useRootStore((state) => state.supply);
  const supplyWithPermit = useRootStore((state) => state.supplyWithPermit);
  // ! variables ************************************************************************************************************
  const requiredChainId = marketChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;
  const poolReserve = reserves.find((reserve) => {
    if (
      currentAssetDetails.underlyingAsset?.toLowerCase() ===
      API_ETH_MOCK_ADDRESS.toLowerCase()
    )
      return reserve.isWrappedBaseAsset;
    return currentAssetDetails.underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;

  const userReserve = user?.userReservesData.find((userReserve) => {
    if (
      currentAssetDetails.underlyingAsset?.toLowerCase() ===
      API_ETH_MOCK_ADDRESS.toLowerCase()
    )
      return userReserve.reserve.isWrappedBaseAsset;
    return currentAssetDetails.underlyingAsset === userReserve.underlyingAsset;
  }) as ComputedUserReserveData;

  const symbol =
    poolReserve?.isWrappedBaseAsset && true
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve?.symbol;
  const nativeBalance =
    walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amount || "0";
  const tokenBalance =
    walletBalances[poolReserve?.underlyingAsset.toLowerCase()]?.amount || "0";
  const blockingError: ErrorType | undefined = undefined;
  const blocked = blockingError !== undefined;
  const supplyUnWrapped =
    currentAssetDetails.underlyingAsset?.toLowerCase() ===
    API_ETH_MOCK_ADDRESS.toLowerCase();
  const poolAddress = supplyUnWrapped
    ? API_ETH_MOCK_ADDRESS
    : poolReserve?.underlyingAsset;
  // console.log("poolAddress 1", isTestnet);
  // console.log("poolAddress 2",poolAddress,utils.getAddress(poolAddress));

  const {
    approval,
    action,
    requiresApproval,
    loadingTxns,
    approvalTxState,
    mainTxState,
  } = useTransactionHandler({
    // TODO: move tryPermit
    tryPermit: true,

    handleGetTxns: () => {
      return supply({
        amountToSupply: `${selectedAmount}`,
        isWrongNetwork,
        poolAddress,
        symbol,
        blocked,
      });
    },
    handleGetPermitTxns: async (signature, deadline) => {
      return supplyWithPermit({
        reserve: poolAddress,
        amount: `${selectedAmount}`,
        signature,
        deadline,
      });
    },
    skip: !`${selectedAmount}` || parseFloat(`${selectedAmount}`) === 0,
    deps: [`${selectedAmount}`, poolAddress],
  });
  // console.log("requiresApproval",approval)
  const handleApproval = () => {
    // console.log("reached here")
    approval(`${selectedAmount}`, poolAddress);
    // supply({
    //   amountToSupply: `${selectedAmount}`,
    //   isWrongNetwork,
    //   poolAddress,
    //   symbol,
    //   blocked,
    // })
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  };

  const hasApprovalError =
    requiresApproval &&
    txError &&
    txError.txAction === TxAction.APPROVAL &&
    txError.actionBlocked;
  const isAmountMissing = false;

  function getMainParams() {
    if (blocked)
      return { disabled: true, content: <span>Supply {symbol}</span> };
    if (
      txError &&
      txError.txAction === TxAction.GAS_ESTIMATION &&
      txError.actionBlocked
    )
      return {
        loading: false,
        disabled: true,
        content: <span>Supply {symbol}</span>,
      };
    if (
      txError &&
      txError.txAction === TxAction.MAIN_ACTION &&
      txError.actionBlocked
    )
      return {
        loading: false,
        disabled: true,
        content: <span>Supply {symbol}</span>,
      };
    if (isWrongNetwork)
      return { disabled: true, content: <span>Wrong Network</span> };
    if (isAmountMissing)
      return { disabled: true, content: <span>Enter an amount</span> };
    if (loadingTxns || isEmpty(mainTxState))
      return { disabled: true, loading: true };
    // if (hasApprovalError && handleRetry)
    //   return { content: <Trans>Retry with approval</Trans>, handleClick: handleRetry };
    if (mainTxState?.loading)
      return {
        loading: true,
        disabled: true,
        content: <span>Supplying {symbol}</span>,
      };
    if (requiresApproval && !approvalTxState?.success)
      return { disabled: true, content: <span>Supply {symbol}</span> };
    return { content: <span>Supply {symbol}</span>, handleClick: action };
  }

  function getApprovalParams() {
    // console.log(
    //   "from here",
    //   !requiresApproval,
    //   isWrongNetwork,
    //   isAmountMissing,
    //   loadingTxns,
    //   hasApprovalError
    // );
    if (
      !requiresApproval ||
      isWrongNetwork ||
      isAmountMissing ||
      loadingTxns ||
      hasApprovalError
    )
      return null;
    if (approvalTxState?.loading)
      return {
        loading: true,
        disabled: true,
        content: <span>Approving {symbol}...</span>,
      };
    if (approvalTxState?.success)
      return { disabled: true, content: <span>Approved</span> };
    if (retryWithApproval)
      return {
        content: <span>Retry with approval</span>,
        handleClick: handleApproval,
      };
    return {
      content: <span>Approve to continue</span>,
      handleClick: handleApproval,
    };
  }

  const { content, disabled, loading, handleClick } = getMainParams();
  const approvalParams = getApprovalParams();
  // console.log("approvalParams", approvalParams);
  // ! Effects ************************************************************************************************************
  useEffect(() => {
    console.log("supplyTxState", supplyTxState);
    if (supplyTxState.success) {
      router.push({
        pathname: "/lend/success",
        query: {
          underlyingAsset: currentAssetDetails.underlyingAsset,
          amount: selectedAmount,
        },
      });
      clearModalContext();
    }
  }, [supplyTxState]);

  useEffect(() => {
    if (selectedAsset) {
      const found = availableReserves.find(
        (singleAsset: emptyObject) => singleAsset.id == selectedAsset
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
    setMaxBalance("");
    setSelectedAsset(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.value", event.target.value);
    // if (decimalNumberRegex.test(event.target.value))
    setSelectedAmount(event.target.value);
  };
  const setMaxBalance = (balance: string): any => {
    setSelectedAmount(balance);
  };

  // console.log("supplyReserves", availableReserves, supplyReserves);
  const fetchYearlyEarnings = () => {
    const interest_rate = currentAssetDetails.supplyAPY;
    if (Number(interest_rate))
      return shortenNumber(+selectedAmount * Number(interest_rate));
    return 0;
  };
  // console.log(reserves);
  const lendAsset = () => {
    console.log("begin lending");

    // supply({
    //   amountToSupply: `${selectedAmount}`,
    //   isWrongNetwork: false,
    //   poolAddress: currentMarketData.addresses.LENDING_POOL,
    //   symbol: currentNetworkConfig.baseAssetSymbol,
    //   blocked: false,
    // });
  };
  // console.log("handleApproval",handleApproval)
  return (
    <div className={styles.container}>
      <FlowLayout
        sectionTitle={
          selectedAsset ? "Select lending amount" : "Select lending asset"
        }
        title={
          selectedAsset ? (
            <>Enter how much you want to lend and earn interest</>
          ) : (
            <>Let’s now choose the asset you want to lend</>
          )
        }
        proceedButtonText="Lend"
        // nextPath="/lend/success"
        clickHandle={action}
      >
        <AssetAmountSelection
          selectedAmount={selectedAmount}
          selectedAsset={selectedAsset}
          updateAsset={handleAssetChange}
          updateAmount={handleAmountChange}
          setMaxBalance={setMaxBalance as any}
          availableReserves={availableReserves}
          walletBalance={currentAssetDetails.walletBalance}
        />
        {selectedAsset && (
          <span className={styles.wallet_balance_text}>
            Wallet balance:{" "}
            {shortenLongNumber(currentAssetDetails.walletBalance)}
          </span>
        )}
        {!selectedAsset && (
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
                {shortenAPY(currentAssetDetails.supplyAPY)}
              </span>
            </div>
            <div className={styles.selected_asset_details__container}>
              <span>Yearly earning</span>
              <span style={{ fontSize: "24px", color: "#31C48D" }}>
                {fetchYearlyEarnings()}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.wallet_assets_container}>
            {supplyReserves.length > 0 &&
              supplyReserves.map((singleToken: emptyObject, index) => {
                return (
                  <WalletAssetDetails
                    key={`${singleToken.name} - ${index}`}
                    tokenName={networkName}
                    tokenBalance={+shortenLongNumber(singleToken.walletBalance)}
                    tokenInterestRate={shortenAPY(singleToken.supplyAPY)}
                    tokenIcon={
                      <Image
                        src={`${networkLogoPath}`}
                        alt="back_btn"
                        height={28}
                        width={28}
                      />
                    }
                    clickHandle={() => setSelectedAsset(singleToken.id)}
                  />
                );
              })}
          </div>
        )}
      </FlowLayout>
    </div>
  );
}

export default ChooseLendingAsset;
