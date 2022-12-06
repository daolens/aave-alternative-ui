import { useRouter } from "next/router";
import ChooseLendingAsset from "../../components/lendFlowCards/ChooseLendingAsset";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Home() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ChooseLendingAsset />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
