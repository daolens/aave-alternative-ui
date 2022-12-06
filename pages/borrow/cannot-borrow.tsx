import { useRouter } from "next/router";
import CustomBoxComponent from "../../components/wrappers/CustomBoxComponent";
import DashboardLayout from "../../layouts/DashboardLayout";
import FlowLayout from "../../layouts/FlowLayout";


export default function Home() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <FlowLayout
          sectionTitle={"Cannot borrow assets"}
          title={
            <>
              You don’t have any borrowing capacity yet, as you haven’t lent any
              assets.
            </>
          } 
          nextPath=""
        ></FlowLayout>
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
