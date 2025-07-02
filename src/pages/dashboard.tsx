import React from "react";
import dynamic from "next/dynamic";

const DashboardContent = dynamic(
  () => import("../components/dashboard/DashboardContent"),
  {
    ssr: false,
  }
);

const DashboardPage = () => {
  return <DashboardContent />;
};

export default DashboardPage;
