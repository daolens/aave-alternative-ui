
import ConnectWalletScreen from "../components/ConnectWalletScreen";
import CustomBoxComponent from "../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../layouts/DashboardLayout";


export default function Home() {
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ConnectWalletScreen />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
