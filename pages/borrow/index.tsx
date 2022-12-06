import { useRouter } from "next/router"; 

import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
export default function Home() {
  const router = useRouter();
  
  return (
    <DashboardLayout>
      <CustomBoxComponent>

      </CustomBoxComponent>
    </DashboardLayout>
  );
}
