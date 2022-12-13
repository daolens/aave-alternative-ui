import ConnectWalletScreen from "components/ConnectWalletScreen";
import MobileScreenMessage from "components/MobileScreenMessage";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useWindowSize from "src/hooks/useWindowSize";
import { useWeb3Context } from "src/libs/hooks/useWeb3Context";
import FlowSelectionScreen from "../components/FlowSelectionScreen";
import CustomBoxComponent from "../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { connected, loading } = useWeb3Context();
  const { windowSize } = useWindowSize();
  // console.log("connected", connected);
  useEffect(() => {
    if (loading) return;
    setIsLoading(false);
  }, [loading]);
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        {connected ? <FlowSelectionScreen /> : <ConnectWalletScreen />}
      </CustomBoxComponent>
    </DashboardLayout>
  );
  // if (windowSize && windowSize.width) {
  //   return windowSize?.width < 1200 ? (
  //     <MobileScreenMessage />
  //   ) : (
  //     <DashboardLayout>
  //       <CustomBoxComponent>
  //         {connected ? <FlowSelectionScreen /> : <ConnectWalletScreen />}
  //       </CustomBoxComponent>
  //     </DashboardLayout>
  //   );
  // }
}
