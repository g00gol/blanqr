import React from "react";
import { Outlet } from "react-router-dom";

import Nav from "@/components/nav";

export default function DashboardPage(): React.ReactElement {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
