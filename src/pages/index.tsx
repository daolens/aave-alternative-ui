import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ConnectWalletScreen from "../../components/ConnectWalletScreen";
import FlowSelectionScreen from "../../components/FlowSelectionScreen";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  // ! Temporary
  // const [isWalletSet, setIsWalletSet] = useState(false);
  useEffect(() => {
    if (!Boolean(window.localStorage.getItem("isWalletSet")))
      router.push("/connect-wallet");
    // setIsWalletSet(Boolean(window.localStorage.getItem("isWalletSet")));
  }, []);

  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <FlowSelectionScreen />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
