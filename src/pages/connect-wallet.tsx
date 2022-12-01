import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import ConnectWalletScreen from "../../components/ConnectWalletScreen";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ConnectWalletScreen />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
