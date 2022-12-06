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
import { Divider } from "@mui/material";
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
}
function AssetAmountSelection({
  selectedAmount,
  selectedAsset,
  updateAsset,
  updateAmount,
  setMaxBalance,
  availableReserves,
  walletBalance,
}: Props) {
  // ! Local helpers
  const fetchBalance = (assetId: string) => {
    if (availableReserves) {
      const found: any = availableReserves.find(
        (singleAsset: emptyObject) => singleAsset.id == assetId
      );
      if (found) return shortenNumber(+found?.walletBalance);
    }
    return 0;
  };
  return (
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
          sx={{ color: "#ffffff" }}
        >
          {/* <div className={styles.table_container}> */}
          <div className={styles.table_container__head}>
            <span>Asset name</span>
            <span>Annual interest rate</span>
            <span>Wallet balance</span>
          </div>
          {availableReserves &&
            availableReserves.length > 0 &&
            availableReserves?.map((singleRow: emptyObject, index: number) => {
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
            })}
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
            ${+selectedAmount * 0.5}
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
  );
}

export default AssetAmountSelection;
