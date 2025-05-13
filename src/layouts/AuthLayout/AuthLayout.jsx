import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";

export default function AuthLayout() {
  return (
    <div>
      <HeaderAuth />
      <Outlet />
    </div>
  );
}
