import DashboardContent from "components/dashboardComponents/DashboardContent";
import CustomBoxComponent from "components/wrappers/CustomBoxComponent";
import DashboardLayout from "layouts/DashboardLayout";
import React from "react";

function Dashboard() {
  return (
    <DashboardLayout>
      <CustomBoxComponent>
        <DashboardContent />
      </CustomBoxComponent>
    </DashboardLayout>
  );
}

export default Dashboard;
