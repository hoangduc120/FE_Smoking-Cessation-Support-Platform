import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useSelector } from "react-redux";
export default function MainLayout() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <div>
      {currentUser ? <Header /> : <HeaderAuth />}
      <Outlet />
      <Footer />
    </div>
  );
}
