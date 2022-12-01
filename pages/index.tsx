import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import ConnectWalletScreen from "../components/ConnectWalletScreen";
import FlowSelectionScreen from "../components/FlowSelectionScreen";
import CustomBoxComponent from "../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true)
  const {connected,loading}= useWeb3Context();
  console.log("connected");
  // useEffect(() => {
  //   if (loading) return
  //   setIsLoading(false)
  // }, [loading]);
console.log("loading",connected,loading)
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        {connected && <FlowSelectionScreen />}
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
