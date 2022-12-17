import { API_ETH_MOCK_ADDRESS, InterestRate } from '@aave/contract-helpers';
import Image from 'next/image';
import React, { Fragment } from 'react'
import { ComputedUserReserveData, useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { fetchIconSymbolAndName } from 'src/ui-config/reservePatches';
import styles from "../../styles/componentStyles/dashboardComponents/DashboardContent.module.css";

function BorrowedAssets() {

  const { user, loading } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
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
  return (
      <>{ borrowPositions.length > 0 &&
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
                      {(
                        Number(singleBorrow.reserve.stableBorrowAPY) * 100
                      ).toFixed(2) == "0.00"
                        ? "<0.01"
                        : (
                            Number(singleBorrow.reserve.stableBorrowAPY) * 100
                          ).toFixed(2)}
                      %
                    </span>
                    <span>Repay</span>
                  </div>
                </Fragment>
              );
            })}</>
  )
}

export default BorrowedAssets