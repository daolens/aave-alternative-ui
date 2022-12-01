import { useRouter } from "next/router"; 
import { useEffect } from "react";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import styles from "../styles/Home.module.css";
export default function Home() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <CustomBoxComponent>

      </CustomBoxComponent>
    </DashboardLayout>
  );
}
