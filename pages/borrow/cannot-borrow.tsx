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
              Coming soon!
              <br />
              Daolens is working on the borrowing functionality.
            </>
          }
          nextPath=""
        ></FlowLayout>
      </CustomBoxComponent>
    </DashboardLayout>
  );
}
