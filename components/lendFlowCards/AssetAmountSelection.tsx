import React, {
  ChangeEventHandler,
  MouseEventHandler,
  ReactNode,
  useState,
} from "react";
import styles from "../../styles/componentStyles/lendFlowCards/assetAmountSelection.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import lendingAssetData from "../../store/staticData/lendingAssetDetails.json";
import { shortenAPY, shortenNumber } from "src/helpers/shortenStrings";
import { emptyObject } from "src/helpers/types";
import { Divider, useMediaQuery } from "@mui/material";
import { FormattedNumber } from "src/components/primitives/FormattedNumber";
import { useTheme } from "@mui/material";
import BigNumber from "bignumber.js";
import { useAppDataContext } from "src/hooks/app-data-provider/useAppDataProvider";
import { USD_DECIMALS } from "@aave/math-utils";
interface Props {
  selectedAsset?: string;
  selectedAmount: string;
  updateAsset?:
    | ((event: SelectChangeEvent<string>, child: ReactNode) => void)
    | undefined;
  updateAmount?: ChangeEventHandler<HTMLInputElement> | undefined;
  setMaxBalance: MouseEventHandler<HTMLDivElement> | undefined;
  availableReserves?: Array<object>;
  walletBalance: number;
  poolReserve?: any;
}
function AssetAmountSelection({
  selectedAmount,
  selectedAsset,
  updateAsset,
  updateAmount,
  setMaxBalance,
  availableReserves,
  walletBalance,
  poolReserve,
}: Props) {
  // ! Local helpers
  const { marketReferencePriceInUsd, user } = useAppDataContext();
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down("sm"));
  const valueTypographyVariant = downToSM ? "main16" : "main21";
  const noDataTypographyVariant = downToSM ? "secondary16" : "secondary21";

  // Calculation of future HF
  const amountIntEth = new BigNumber(selectedAmount).multipliedBy(
    poolReserve?.formattedPriceInMarketReferenceCurrency
  );
  // TODO: is it correct to ut to -1 if user doesnt exist?
  const amountInUsd = amountIntEth
    .multipliedBy(marketReferencePriceInUsd)
    .shiftedBy(-USD_DECIMALS);
  // console.log("here", amountInUsd.toString(10));
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <InputLabel
            id="demo-simple-select-standard-label"
            sx={{ color: "#ffffff" }}
          >
            Choose asset to lend
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="lend_asset_selection_dropdown"
            value={selectedAsset}
            onChange={updateAsset}
            label="Choose asset to lend"
            sx={{
              color: "#ffffff",
              "&::before": { border: "none" },
              "&:hover": { border: "none" },
            }}
          >
            {/* <div className={styles.table_container}> */}
            <div className={styles.table_container__head}>
              <span>Asset name</span>
              <span>Annual interest rate</span>
              <span>Wallet balance</span>
            </div>
            {availableReserves &&
              availableReserves.length > 0 &&
              availableReserves?.map(
                (singleRow: emptyObject, index: number) => {
                  return (
                    <MenuItem
                      key={`${singleRow.name} ${index}`}
                      value={singleRow.id}
                      className={styles.table_container__data}
                    >
                      <span>{singleRow.name}</span>
                      <span>{shortenAPY(singleRow.supplyAPY)}</span>
                      <span>{shortenNumber(+singleRow.walletBalance)}</span>
                    </MenuItem>
                  );
                }
              )}
            {/* </div> */}
          </Select>
        </FormControl>
        {selectedAsset && (
          <div className={styles.amount_input_container}>
            {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
            <input
              placeholder="Enter amount to lend"
              className={styles.amount_input_container__input}
              aria-label="amount-input"
              type="number"
              value={selectedAmount}
              onChange={updateAmount}
            />
            <span className={styles.amount_input_container__dollar}>
              {selectedAmount && (
                <>${amountInUsd.toString(10)}</>
              )}
              {/* <FormattedNumber
                value={Number(selectedAmount || 0)}
                symbol="USD"
                variant={valueTypographyVariant}
                visibleDecimals={2}
                compact
                symbolsColor="#A5A8B6"
                symbolsVariant={noDataTypographyVariant}
              /> */}
            </span>
            <span
              className={styles.amount_input_container__max_cta}
              onClick={() => {
                return setMaxBalance?.(walletBalance as any);
              }}
            >
              MAX
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetAmountSelection;
