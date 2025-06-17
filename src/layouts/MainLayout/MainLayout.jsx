import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import HeaderCoach from "../../components/Header/HeaderCoach";
import Footer from "../../components/Footer/Footer";
import { useSelector } from "react-redux";

export default function MainLayout() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  const renderHeader = () => {
    if (!currentUser || !currentUser.user) {
      return <HeaderAuth />;
    }
    if (currentUser.user.role === "coach") {
      return <HeaderCoach />;
    }
    return <Header />;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {renderHeader()}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
