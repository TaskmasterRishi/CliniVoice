import React from "react";
import AppHeader from "./_components/AppHeader";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <AppHeader />
      <div className="">{children}</div>
    </div>
  );
};

export default DashboardLayout;
