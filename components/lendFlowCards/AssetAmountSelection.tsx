import React, { useState } from "react";
import styles from "../../styles/componentStyles/lendFlowCards/assetAmountSelection.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import lendingAssetData from "../../store/staticData/lendingAssetDetails.json";
interface Props {
  selectedAsset?: string;
  selectedAmount?: number;
  updateAsset?: Function;
  updateAmount?: Function;
  setMaxBalance?: Function;
}
function createData(
  id: string,
  name: string,
  interest_rate: string,
  balance: number
) {
  return { id, name, interest_rate, balance };
}
// const rows = [
//   createData('Frozen yoghurt', 159, 6.0),
//   createData('Ice cream sandwich', 237, 9.0),
//   createData('Eclair', 262, 16.0),
//   createData('Cupcake', 305, 3.7),
//   createData('Gingerbread', 356, 16.0),
// ];

const allAssetDetails = lendingAssetData.map((singleAssetData) => {
  return createData(
    singleAssetData.id,
    singleAssetData.name,
    singleAssetData.interest_rate,
    singleAssetData.balance
  );
});
function AssetAmountSelection({
  selectedAmount,
  selectedAsset,
  updateAsset,
  updateAmount,
  setMaxBalance,
}: Props) {
  // ! Local helpers
  const fetchBalance = (assetId: string) => {
    let found = allAssetDetails.find(
      (singleAsset) => singleAsset.id == assetId
    );
    if (found) return found.balance;
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
          id="demo-simple-select-standard"
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
          {allAssetDetails.map((singleRow, index) => {
            return (
              <MenuItem
                key={`${singleRow.name} ${index}`}
                value={singleRow.id}
                className={styles.table_container__data}
              >
                <span>{singleRow.name}</span>
                <span>{singleRow.interest_rate}</span>
                <span>{singleRow.balance}</span>
              </MenuItem>
            );
          })}
          {/* </div> */}
        </Select>
      </FormControl>
      {selectedAsset && (
        <div className={styles.amount_input_container}>
          <input
            placeholder="Enter amount to lend"
            className={styles.amount_input_container__input}
            aria-label="amount-input"
            type="text"
            value={selectedAmount}
            onChange={updateAmount}
          />
          <span className={styles.amount_input_container__dollar}>
            ${selectedAmount * 0.5}
          </span>
          <span
            className={styles.amount_input_container__max_cta}
            onClick={() => {
              setMaxBalance(fetchBalance(selectedAsset));
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
