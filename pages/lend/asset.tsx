import MobileScreenMessage from "components/MobileScreenMessage";
import { useRouter } from "next/router";
import useWindowSize from "src/hooks/useWindowSize";
import ChooseLendingAsset from "../../components/lendFlowCards/ChooseLendingAsset";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ChooseLendingAsset />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
