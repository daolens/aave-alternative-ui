import MobileScreenMessage from "components/MobileScreenMessage";
import useWindowSize from "src/hooks/useWindowSize";
import ConnectWalletScreen from "../components/ConnectWalletScreen";
import CustomBoxComponent from "../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Home() {
  const { windowSize } = useWindowSize();

  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ConnectWalletScreen />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
