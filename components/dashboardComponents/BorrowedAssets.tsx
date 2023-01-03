import { API_ETH_MOCK_ADDRESS, InterestRate } from "@aave/contract-helpers";
import {
  calculateHealthFactorFromBalancesBigUnits,
  valueToBigNumber,
} from "@aave/math-utils";
import { useTheme } from "@emotion/react";
import BigNumber from "bignumber.js";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
// import { utils } from "ethers";
import { isEmpty } from "lodash";
import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { DetailsHFLine } from "src/components/transactions/FlowCommons/TxModalDetails";
import { emptyObject } from "src/helpers/types";
import { useTransactionHandler } from "src/helpers/useTransactionHandler";
import {
  ComputedReserveData,
  ComputedUserReserveData,
  useAppDataContext,
} from "src/hooks/app-data-provider/useAppDataProvider";
import { useModalContext } from "src/hooks/useModal";
import { usePermissions } from "src/hooks/usePermissions";
import { useProtocolDataContext } from "src/hooks/useProtocolDataContext";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import { useRootStore } from "src/store/root";
import { TxAction } from "src/ui-config/errorMapping";
import { permitByChainAndToken } from "src/ui-config/permitConfig";
import { fetchIconSymbolAndName } from "src/ui-config/reservePatches";
import { getNetworkConfig } from "src/utils/marketsAndNetworksConfig";
import styles from "../../styles/componentStyles/dashboardComponents/DashboardContent.module.css";
import { GasStation } from "src/components/transactions/GasStation/GasStation";
import { parseUnits } from "ethers/lib/utils";
export enum ErrorType {
  CAP_REACHED,
}
function BorrowedAssets() {
  // ! Local states
  const [selectedAmount, setSelectedAmount] = useState("");
  const [currentAssetDetails, setCurrentAssetDetails] = useState(
    {} as emptyObject
  );
  const [_amount, setAmount] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [open, setOpen] = React.useState(false);
  // const [interestRateMode, setInterestRateMode] = useState<InterestRate>(
  //   InterestRate.Variable
  // );
  const [
    borrowUnWrapped,
    // setBorrowUnWrapped
  ] = useState(true);
  const theme = useTheme();
  // ! Contexts
  const {
    currentChainId: marketChainId,
    currentNetworkConfig,
    // currentMarketData,
  } = useProtocolDataContext();
  const { chainId: connectedChainId, switchNetwork } = useWeb3Context();

  const { user, reserves } = useAppDataContext();
  const {
    txError,
    mainTxState: repayTxState,
    retryWithApproval,
    close: clearModalContext,
    // gasLimit,
  } = useModalContext();
  // const { permissions } = usePermissions();

  // ! Variables
  const borrowPositions =
    user?.userReservesData.reduce((acc, userReserve) => {
      if (userReserve.variableBorrows !== "0") {
        acc.push({
          ...userReserve,
          borrowRateMode: InterestRate.Variable,
          reserve: {
            ...userReserve.reserve,
            ...(userReserve.reserve.isWrappedBaseAsset
              ? fetchIconSymbolAndName({
                  symbol: currentNetworkConfig.baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                })
              : {}),
          },
        });
      }
      if (userReserve.stableBorrows !== "0") {
        acc.push({
          ...userReserve,
          borrowRateMode: InterestRate.Stable,
          reserve: {
            ...userReserve.reserve,
            ...(userReserve.reserve.isWrappedBaseAsset
              ? fetchIconSymbolAndName({
                  symbol: currentNetworkConfig.baseAssetSymbol,
                  underlyingAsset: API_ETH_MOCK_ADDRESS.toLowerCase(),
                })
              : {}),
          },
        });
      }
      return acc;
    }, [] as (ComputedUserReserveData & { borrowRateMode: InterestRate })[]) ||
    [];

  const requiredChainId = marketChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;

  const poolReserve = reserves.find((reserve) => {
    if (
      currentAssetDetails?.underlyingAsset?.toLowerCase() ===
      API_ETH_MOCK_ADDRESS.toLowerCase()
    )
      return reserve.isWrappedBaseAsset;
    return currentAssetDetails?.underlyingAsset === reserve.underlyingAsset;
  }) as ComputedReserveData;

  const userReserve = user?.userReservesData.find((userReserve) => {
    if (
      currentAssetDetails?.underlyingAsset?.toLowerCase() ===
      API_ETH_MOCK_ADDRESS.toLowerCase()
    )
      return userReserve.reserve.isWrappedBaseAsset;
    return currentAssetDetails?.underlyingAsset === userReserve.underlyingAsset;
  }) as ComputedUserReserveData;

  const symbol =
    poolReserve?.isWrappedBaseAsset && true
      ? currentNetworkConfig.baseAssetSymbol
      : poolReserve?.symbol;

  const blockingError: ErrorType | undefined = undefined;
  const blocked = blockingError !== undefined;
  const repay = useRootStore((state) => state.repay);
  const repayWithPermit = useRootStore((state) => state.repayWithPermit);
  const tokenToRepayWith = {
    address: poolReserve?.underlyingAsset,
    symbol: poolReserve?.symbol,
    iconSymbol: poolReserve?.iconSymbol,
    balance: currentAssetDetails.underlyingBalance,
  };
  const networkConfig = getNetworkConfig(marketChainId);
  let maxAmountToRepay: BigNumber;
  let balance: string;
  const repayWithATokens =
    tokenToRepayWith.address === poolReserve?.aTokenAddress;
  if (repayWithATokens) {
    maxAmountToRepay = BigNumber.min(
      currentAssetDetails.underlyingBalance,
      userReserve?.stableBorrows
    );
    balance = currentAssetDetails.underlyingBalance;
  } else {
    const normalizedWalletBalance = valueToBigNumber(
      tokenToRepayWith.balance
    ).minus(
      userReserve?.reserve.symbol.toUpperCase() ===
        networkConfig.baseAssetSymbol
        ? "0.004"
        : "0"
    );
    balance = normalizedWalletBalance.toString(10);
    maxAmountToRepay = BigNumber.min(
      normalizedWalletBalance,
      userReserve?.stableBorrows
    );
  }
  //   console.log("currentAssetDetails", currentAssetDetails);
  const poolAddress =
    borrowUnWrapped && poolReserve?.isWrappedBaseAsset
      ? API_ETH_MOCK_ADDRESS
      : poolReserve?.underlyingAsset;
  const {
    approval,
    action,
    requiresApproval,
    loadingTxns,
    approvalTxState,
    mainTxState,
  } = useTransactionHandler({
    // move tryPermit to store
    tryPermit: false,
    handleGetTxns: async () => {
      return repay({
        amountToRepay: selectedAmount,
        poolAddress,
        repayWithATokens,
        debtType:
          InterestRate[
            currentAssetDetails.borrowRateMode === "Stable"
              ? "Stable"
              : "Variable"
          ],
        poolReserve,
        isWrongNetwork,
        symbol,
      });
    },
    handleGetPermitTxns: async (signature, deadline) => {
      return repayWithPermit({
        amountToRepay: selectedAmount,
        poolReserve,
        isWrongNetwork,
        poolAddress,
        symbol,
        debtType:
          InterestRate[
            currentAssetDetails.borrowRateMode === "Stable"
              ? "Stable"
              : "Variable"
          ],
        repayWithATokens,
        signature,
        deadline,
      });
    },
    skip: !selectedAmount || parseFloat(selectedAmount) === 0 || blocked,
    deps: [selectedAmount, poolAddress, repayWithATokens],
  });
  const handleApproval = () => {
    approval(`${selectedAmount}`, poolAddress);
  };
  const isAmountMissing = false;
  const hasApprovalError =
    requiresApproval &&
    txError &&
    txError.txAction === TxAction.APPROVAL &&
    txError.actionBlocked;
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

  const {
    content,
    disabled,
    loading: mainLoading,
    handleClick,
  } = getMainParams();
  const approvalParams = getApprovalParams();
  // ! Local handlers
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedAmount("");
    setIsSuccessful(false);
    clearModalContext();
    setOpen(false);
  };
  const repayAsset = () => {
    if (isWrongNetwork) {
      if (confirm("Your selected network is incorrect. Switch now?")) {
        switchNetwork(requiredChainId);
        return;
      } else {
        return;
      }
    }
    if (loadingTxns || repayTxState.loading) return;
    if (!selectedAmount) return alert("Add an amount greater than 0");

    // console.log("foundAsset", foundAsset);
    if (!currentAssetDetails.reserve) return alert("Cannot repay");
    if (+currentAssetDetails.totalBorrows < +selectedAmount)
      return alert("Cannot repay more than you have");
    return approvalParams && approvalParams.handleClick
      ? approvalParams.handleClick()
      : action();
  };

  const newHF = selectedAmount
    ? calculateHealthFactorFromBalancesBigUnits({
        collateralBalanceMarketReferenceCurrency:
          repayWithATokens && userReserve?.usageAsCollateralEnabledOnUser
            ? valueToBigNumber(user?.totalCollateralUSD || "0").minus(
                valueToBigNumber(
                  currentAssetDetails?.reserve.priceInUSD
                ).multipliedBy(selectedAmount)
              )
            : user?.totalCollateralUSD || "0",
        borrowBalanceMarketReferenceCurrency: valueToBigNumber(
          user?.totalBorrowsUSD || "0"
        ).minus(
          valueToBigNumber(
            currentAssetDetails?.reserve.priceInUSD
          ).multipliedBy(selectedAmount)
        ),
        currentLiquidationThreshold: user?.currentLiquidationThreshold || "0",
      }).toString(10)
    : user?.healthFactor;
  // ! Effects
  useEffect(() => {
    setAmount(selectedAmount);
  }, [selectedAmount]);
  useEffect(() => {
    // console.log("supplyTxState", supplyTxState);
    if (repayTxState.success) {
      setIsSuccessful(true);
    }
  }, [repayTxState]);
  //  useEffect(() => {
  //   window?.document.addEventListener("wheel", function (event) {
  //     if (window?.document?.activeElement?.type === "number") {
  //       window?.document?.activeElement?.blur();
  //     }
  //   });
  // }, []);
  // console.log("repayTxState", repayTxState);

  return (
    <>
      {borrowPositions.length > 0 ? (
        borrowPositions.map((singleBorrow) => {
          return (
            <Fragment key={singleBorrow.underlyingAsset}>
              <div className={styles.table_content}>
                <span>
                  <Image
                    src={`/icons/tokens/${singleBorrow.reserve.iconSymbol.toLowerCase()}.svg`}
                    alt="aave_mascot"
                    height={30}
                    width={30}
                  />
                  {singleBorrow.reserve.name}
                </span>
                <span>
                  {Number(singleBorrow.totalBorrows).toFixed(5)}{" "}
                  <span>
                    ${Number(singleBorrow.totalBorrowsUSD).toFixed(2)}
                  </span>
                </span>
                <span>
                  {(Number(singleBorrow.reserve.stableBorrowAPY) * 100).toFixed(
                    2
                  ) == "0.00"
                    ? "<0.01"
                    : (
                        Number(singleBorrow.reserve.stableBorrowAPY) * 100
                      ).toFixed(2)}
                  %
                </span>
                <span
                  onClick={() => {
                    setCurrentAssetDetails(singleBorrow);
                    handleClickOpen();
                  }}
                >
                  Repay
                </span>
              </div>
            </Fragment>
          );
        })
      ) : (
        <p style={{ width: "100%", textAlign: "center" }}>
          No assets borrowed yet
        </p>
      )}
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
                "Repay " + currentAssetDetails.reserve.name
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
                  You repaid {selectedAmount} {currentAssetDetails.reserve.name}
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
                     onWheel={(e) => e.currentTarget.blur()}
                      type="number"
                      placeholder="Enter Amount"
                      value={selectedAmount}
                      onChange={(ev) => {
                        setSelectedAmount(ev.target.value);
                      }}
                    />
                    {/* <span>50$</span> */}
                  </div>
                </div>
                <span className={styles.wallet_balance}>
                  Amount borrowed:{" "}
                  {Number(currentAssetDetails.totalBorrows).toFixed(5)}
                </span>
                <span className={styles.wallet_balance}>
                  Credit health score
                </span>
                <DetailsHFLine
                  visibleHfChange={!!_amount}
                  healthFactor={user ? user.healthFactor : "-1"}
                  futureHealthFactor={newHF}
                />
                {/* <GasStation gasLimit={parseUnits(gasLimit || "0", "wei")} /> */}
                <div className={styles.main_cta} onClick={repayAsset}>
                  <span>
                    {approvalParams && approvalParams.handleClick
                      ? "Approve"
                      : "Repay"}
                  </span>
                  {(loadingTxns || repayTxState.loading) && (
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

export default BorrowedAssets;
