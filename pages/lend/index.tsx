import MobileScreenMessage from "components/MobileScreenMessage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useWindowSize from "src/hooks/useWindowSize";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";

export default function Home() {
  const router = useRouter();
  const { windowSize } = useWindowSize();
  useEffect(() => {
    router.push("/lend/asset");
  }, []);

  return (
    <DashboardLayout>
      <CustomBoxComponent></CustomBoxComponent>
    </DashboardLayout>
  );
}
