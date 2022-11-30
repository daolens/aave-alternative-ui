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
interface assetData {
  id?: string;
  name?: string;
  balance?: number;
  interest_rate?: string;
  icon_slug?: string;
}
function ChooseLendingAsset() {
  // ! Regex
  const decimalNumberRegex = /([0-9]|[1-9][0-9]|[1-9][0-9][0-9])/;
  // ! Local states
  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [currentAssetDetails, setcurrentAssetDetails] = useState({
    id: "",
    name: "",
    balance: 0,
    interest_rate: "-",
    icon_slug: "",
  });
  // ! Effects
  useEffect(() => {
    if (selectedAsset) {
      let found = walletAssetData.find(
        (singleAsset) => singleAsset.id == selectedAsset
      );
      if (found) setcurrentAssetDetails(found);
      else
        setcurrentAssetDetails({
          id: "",
          name: "",
          balance: 0,
          interest_rate: "-",
          icon_slug: "",
        });
      //   if (found) return found;
    }
  }, [selectedAsset]);

  // ! Local handlers
  const handleAssetChange = (event: SelectChangeEvent) => {
    setMaxBalance(0);
    setSelectedAsset(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event.target.value", event.target.value);
    // if (decimalNumberRegex.test(event.target.value))
    setSelectedAmount(event.target.value);
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
    let interest_rate = currentAssetDetails.interest_rate.split("%")[0];
    if (Number(interest_rate)) return selectedAmount * Number(interest_rate);
    return 0;
  };
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
        nextPath="/lend/success"
      >
        <AssetAmountSelection
          selectedAmount={selectedAmount}
          selectedAsset={selectedAsset}
          updateAsset={handleAssetChange}
          updateAmount={handleAmountChange}
          setMaxBalance={setMaxBalance}
        />
        {selectedAsset && (
          <span className={styles.wallet_balance_text}>
            Wallet balance: {currentAssetDetails.balance}
          </span>
        )}
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
              <span>Yearly earning</span>
              <span style={{ fontSize: "24px", color: "#31C48D" }}>
                {fetchYearlyEarnings()}
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.wallet_assets_container}>
            {walletAssetData.map((singleToken: assetData, index) => {
              return (
                <WalletAssetDetails
                  key={`${singleToken.name} - ${index}`}
                  tokenName={singleToken.name}
                  tokenBalance={singleToken.balance}
                  tokenInterestRate={singleToken.interest_rate}
                  tokenIcon={
                    <Image
                      src={`/icons_svg/tokens/${singleToken.icon_slug}`}
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
