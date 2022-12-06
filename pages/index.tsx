import ConnectWalletScreen from "components/ConnectWalletScreen";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import FlowSelectionScreen from "../components/FlowSelectionScreen";
import CustomBoxComponent from "../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { connected, loading } = useWeb3Context();
  // console.log("connected", connected);
  useEffect(() => {
    if (loading) return;
    setIsLoading(false);
  }, [loading]);
  console.log("loading", connected, loading);
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        {connected ? <FlowSelectionScreen /> : <ConnectWalletScreen />}
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
