import { useRouter } from "next/router";
import ChooseBorrowingAsset from "../../components/borrowFlowCards/ChooseBorrowingAsset";
import ChooseLendingAsset from "../../components/lendFlowCards/ChooseLendingAsset";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <ChooseBorrowingAsset />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
