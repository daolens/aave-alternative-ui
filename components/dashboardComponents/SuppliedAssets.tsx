import { API_ETH_MOCK_ADDRESS } from "@aave/contract-helpers";
import {
  calculateHealthFactorFromBalancesBigUnits,
  USD_DECIMALS,
  valueToBigNumber,
} from "@aave/math-utils";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { emptyObject } from "src/helpers/types";
import { useTransactionHandler } from "src/helpers/useTransactionHandler";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useWalletBalances } from "src/hooks/app-data-provider/useWalletBalances";
import { useModalContext } from "src/hooks/useModal";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { useRootStore } from "src/store/root";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import styles from "../../styles/componentStyles/dashboardComponents/DashboardContent.module.css";
import BigNumber from "bignumber.js";
import { isEmpty } from "lodash";
import { TxAction } from "src/ui-config/errorMapping";
export enum ErrorType {
  CAP_REACHED,
}
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { DetailsHFLine } from "src/components/transactions/FlowCommons/TxModalDetails";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";

function SuppliedAssets() {
  const router = useRouter();
  // ! contexts ********************************************************************************
  const { user, reserves, marketReferencePriceInUsd } = useAppDataContext();
  const withdraw = useRootStore((state) => state.withdraw);
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
    mainTxState: withdrawTxState,
    close: clearModalContext,
    gasLimit,
  } = useModalContext();
  const {
    bridge,
    isTestnet,
    baseAssetSymbol,
    name: networkName,
    networkLogoPath,
    wrappedBaseAssetSymbol,
  } = currentNetworkConfig;
  // ! Hooks ********************************************************************************
  const [selectedAmount, setSelectedAmount] = useState("");
  const [currentAssetDetails, setCurrentAssetDetails] = useState(
    {} as emptyObject
  );
  const [_amount, setAmount] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  // ! Variables ********************************************************************************
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
  const amountIntEth = new BigNumber(
    +selectedAmount * currentAssetDetails?.supplyAPY
  ).multipliedBy(poolReserve?.formattedPriceInMarketReferenceCurrency);
  // TODO: is it correct to ut to -1 if user doesnt exist?
  const amountInUsd = amountIntEth
    .multipliedBy(marketReferencePriceInUsd)
    .shiftedBy(-USD_DECIMALS);
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
  let totalCollateralInETHAfterWithdraw = valueToBigNumber(
    user.totalCollateralMarketReferenceCurrency
  );
  const reserveLiquidationThreshold =
    user.isInEmode && user.userEmodeCategoryId === poolReserve?.eModeCategoryId
      ? poolReserve?.formattedEModeLiquidationThreshold
      : poolReserve?.formattedReserveLiquidationThreshold;
  let liquidationThresholdAfterWithdraw = user.currentLiquidationThreshold;
  let healthFactorAfterWithdraw = valueToBigNumber(user.healthFactor);
  if (
    userReserve?.usageAsCollateralEnabledOnUser &&
    poolReserve?.usageAsCollateralEnabled
  ) {
    const amountToWithdrawInEth = valueToBigNumber(selectedAmount).multipliedBy(
      poolReserve?.formattedPriceInMarketReferenceCurrency
    );
    totalCollateralInETHAfterWithdraw = totalCollateralInETHAfterWithdraw.minus(
      amountToWithdrawInEth
    );

    liquidationThresholdAfterWithdraw = valueToBigNumber(
      user.totalCollateralMarketReferenceCurrency
    )
      .multipliedBy(valueToBigNumber(user.currentLiquidationThreshold))
      .minus(
        valueToBigNumber(amountToWithdrawInEth).multipliedBy(
          reserveLiquidationThreshold
        )
      )
      .div(totalCollateralInETHAfterWithdraw)
      .toFixed(4, BigNumber.ROUND_DOWN);

    healthFactorAfterWithdraw = calculateHealthFactorFromBalancesBigUnits({
      collateralBalanceMarketReferenceCurrency:
        totalCollateralInETHAfterWithdraw,
      borrowBalanceMarketReferenceCurrency:
        user.totalBorrowsMarketReferenceCurrency,
      currentLiquidationThreshold: liquidationThresholdAfterWithdraw,
    });
  }
  const {
    action,
    loadingTxns,
    mainTxState,
    approvalTxState,
    approval,
    requiresApproval,
  } = useTransactionHandler({
    tryPermit: false,
    handleGetTxns: async () =>
      withdraw({
        reserve: poolAddress,
        amount: selectedAmount,
        aTokenAddress: poolReserve.aTokenAddress,
      }),
    skip: !selectedAmount || parseFloat(selectedAmount) === 0 || blocked,
    deps: [selectedAmount, poolAddress],
  });
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
  console.log("loadingTxns", loadingTxns, withdrawTxState);
  const suppliedPosition =
    user?.userReservesData
      .filter((userReserve) => userReserve.underlyingBalance !== "0")
      .map((userReserve) => ({
        ...userReserve,
        reserve: {
          ...userReserve.reserve,
          ...(userReserve.reserve.isWrappedBaseAsset
            ? fetchIconSymbolAndName({
                symbol: currentNetworkConfig.baseAssetSymbol,
                underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
              })
            : {}),
        },
      })) || [];
  // ! Local helpers ********************************************************************************

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAmount("");
    setIsSuccessful(false);
    clearModalContext();
    setOpen(false);
  };
  const withdrawAsset = () => {
    if (loadingTxns || withdrawTxState.loading) return;
    if (!selectedAmount) return alert("Add an amount greater than 0");

    // console.log("foundAsset", foundAsset);
    if (!currentAssetDetails.reserve) return alert("Cannot withdraw");
    if (+currentAssetDetails.underlyingBalance < +selectedAmount)
      return alert("Cannot withdraw more than you lent");
    return approvalParams && approvalParams.handleClick
      ? approvalParams.handleClick()
      : action();
  };
  // ! effects
  useEffect(() => {
    setAmount(selectedAmount);
  }, [selectedAmount]);
  useEffect(() => {
    // console.log("supplyTxState", supplyTxState);
    if (withdrawTxState.success) {
      setIsSuccessful(true);
    }
  }, [withdrawTxState]);
  return (
    <>
      {suppliedPosition.length > 0 &&
        suppliedPosition.map((singleSupply) => {
          return (
            <Fragment key={singleSupply.underlyingAsset}>
              <div className={styles.table_content}>
                <span>
                  <Image
                    src={`/icons/tokens/${singleSupply.reserve.iconSymbol.toLowerCase()}.svg`}
                    alt="aave_mascot"
                    height={30}
                    width={30}
                  />
                  {singleSupply.reserve.name}
                </span>
                <span>
                  {Number(singleSupply.underlyingBalance).toFixed(5)}{" "}
                  <span>
                    ${Number(singleSupply.underlyingBalanceUSD).toFixed(2)}
                  </span>
                </span>
                <span>
                  {(Number(singleSupply.reserve.supplyAPY) * 100).toFixed(2) ==
                  "0.00"
                    ? "<0.01"
                    : (Number(singleSupply.reserve.supplyAPY) * 100).toFixed(2)}
                  %
                </span>
                <span
                  onClick={() => {
                    setCurrentAssetDetails(singleSupply);
                    handleClickOpen();
                  }}
                >
                  Withdraw
                </span>
              </div>
            </Fragment>
          );
        })}
      {currentAssetDetails?.reserve && (
        <Dialog
          // fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minWidth: "350px",
            }}
          >
            <span>
              {isSuccessful ? (
                <div></div>
              ) : (
                "Withdraw " + currentAssetDetails.reserve.name
              )}
            </span>
            <Image
              src={`/icons_svg/simple_cross.svg`}
              alt="aave_mascot"
              height={18}
              width={18}
              style={{ cursor: "pointer" }}
              onClick={handleClose}
            />
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {isSuccessful ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Image
                  src={`/icons_svg/check_green.svg`}
                  alt="checkmark"
                  height={40}
                  width={40}
                />
                <span
                  style={{
                    fontSize: "24px",
                    color: "#EAEBEF",
                    fontWeight: "600",
                    display: "inline-block",
                    margin: "10px 0",
                  }}
                >
                  Awesome
                </span>
                <span
                  style={{
                    fontSize: "16px",
                    color: "#A5A8B6",
                    fontWeight: "500",
                    display: "inline-block",
                    margin: "5px 0 20px 0",
                  }}
                >
                  You withdrew {selectedAmount}{" "}
                  {currentAssetDetails.reserve.name}
                </span>
                <div className={styles.main_cta} onClick={handleClose}>
                  <span>Done</span>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.asset_amount_wrapper}>
                  <div className={styles.asset_amount_selector}>
                    <span>
                      <Image
                        src={`/icons/tokens/${currentAssetDetails.reserve.iconSymbol.toLowerCase()}.svg`}
                        alt="aave_mascot"
                        height={20}
                        width={20}
                      />
                      {currentAssetDetails.reserve.name}
                    </span>
                    <input
                      type="number"
                      placeholder="Enter Amount"
                      value={selectedAmount}
                      onChange={(ev) => {
                        setSelectedAmount(ev.target.value);
                      }}
                    />
                    <span>50$</span>
                  </div>
                </div>
                <span className={styles.wallet_balance}>
                  Amount lent:{" "}
                  {Number(currentAssetDetails.underlyingBalance).toFixed(5)}
                </span>
                <span className={styles.wallet_balance}>
                  Credit health score
                </span>
                <DetailsHFLine
                  visibleHfChange={!!_amount}
                  healthFactor={user ? user.healthFactor : "-1"}
                  futureHealthFactor={healthFactorAfterWithdraw.toString(10)}
                />
                <div className={styles.main_cta} onClick={withdrawAsset}>
                  <span>Withdraw</span>
                  {(loadingTxns || withdrawTxState.loading) && (
                    <CircularProgress size={18} sx={{ margin: "0px" }} />
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default SuppliedAssets;
