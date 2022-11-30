import { useRouter } from "next/router";
import ChooseLendingAsset from "../../components/lendFlowCards/ChooseLendingAsset";
import LendingSuccessful from "../../components/lendFlowCards/LendingSuccessful";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <LendingSuccessful />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}