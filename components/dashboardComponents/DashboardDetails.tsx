import Image from "next/image";
import React from "react";
import { useAppDataContext } from "src/hooks/app-data-provider/useAppDataProvider";
import styles from "../../styles/componentStyles/dashboardComponents/DashboardDetails.module.css";
function DashboardDetails() {
  const { user, loading } = useAppDataContext();
  return (
    <div className={styles.container}>
      <div className={styles.single_detail}>
        <div className={styles.single_detail__top}>
          <Image
            src="/icons_svg/net_worth_icon.svg"
            alt="aave_amscot"
            height={16}
            width={16}
          />
          <span>NET WORTH</span>
        </div>
        <div className={styles.single_detail__bottom}>
          <span style={{ color: "#A5A8B6" }}>$</span>
          <span>{Number(user?.netWorthUSD || 0).toFixed(2)}</span>
        </div>
      </div>
      <div className={styles.single_detail}>
        <div className={styles.single_detail__top}>
          <Image
            src="/icons_svg/heart_icon.svg"
            alt="aave_amscot"
            height={16}
            width={16}
          />
          <span>CREDIT HEALTH</span>
        </div>
        <div className={styles.single_detail__bottom}>
          <span style={{ color: "#31C48D" }}>{Number(user?.healthFactor || '-1').toFixed(2)}</span>
        </div>
      </div>
      <div className={styles.single_detail}>
        <div className={styles.single_detail__top}>
          <Image
            src="/icons_svg/heart_icon.svg"
            alt="aave_amscot"
            height={16}
            width={16}
          />
          <span>NET INTEREST</span>
        </div>
        <div className={styles.single_detail__bottom}>
          <span>{(Number(user?.netAPY*100 || 0)).toFixed(3)}%</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardDetails;
