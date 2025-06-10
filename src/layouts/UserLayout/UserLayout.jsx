
import React from "react";
import { Outlet } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

export default function ChatLayout() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
        }}
      >
        {currentUser ? <Header /> : <HeaderAuth />}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: "64px",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
