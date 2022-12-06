import MobileScreenMessage from "components/MobileScreenMessage";
import { useRouter } from "next/router";
import useWindowSize from "src/hooks/useWindowSize";
import ChooseBorrowingAsset from "../../components/borrowFlowCards/ChooseBorrowingAsset";

import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Home() {
  const router = useRouter();
  const { windowSize } = useWindowSize();

  if (windowSize && windowSize.width) {
    return windowSize?.width < 1200 ? (
      <MobileScreenMessage />
    ) : (
      <DashboardLayout>
        <CustomBoxComponent>
          <ChooseBorrowingAsset />
        </CustomBoxComponent>
      </DashboardLayout>
    );
  }
}
