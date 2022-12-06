import MobileScreenMessage from "components/MobileScreenMessage";
import { useRouter } from "next/router";
import useWindowSize from "src/hooks/useWindowSize";
import ChooseLendingAsset from "../../components/lendFlowCards/ChooseLendingAsset";
import LendingSuccessful from "../../components/lendFlowCards/LendingSuccessful";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Home() {
  const { windowSize } = useWindowSize();

  if (windowSize && windowSize.width) {
    return windowSize?.width < 1200 ? (
      <MobileScreenMessage />
    ) : (
      <DashboardLayout>
        <CustomBoxComponent>
          <LendingSuccessful />
        </CustomBoxComponent>
      </DashboardLayout>
    );
  }
}
