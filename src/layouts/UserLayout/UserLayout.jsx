// import React from "react";
// import { Outlet } from "react-router-dom";
// import HeaderAuth from "../../components/Header/HeaderAuth";
// import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
// import { useSelector } from "react-redux";
// import { Box } from "@mui/material";

// export default function UserLayout() {
//   const currentUser = useSelector((state) => state.auth.currentUser);

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       {/* Header with high z-index to stay above other elements */}
//       <Box
//         sx={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1100, // Ensure header is above sidebar
//         }}
//       >
//         {currentUser ? <Header /> : <HeaderAuth />}
//       </Box>

//       {/* Main content with padding to avoid overlap with fixed header */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           paddingTop: "64px", // Adjust based on header height
//           overflow: "auto",
//         }}
//       >
//         <Outlet />
//       </Box>

//       {/* Footer */}
//       <Footer />
//     </Box>
//   );
// }

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
      {/* Header with high z-index to stay above other elements */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200, // Ở trên tất cả các thành phần khác
        }}
      >
        {currentUser ? <Header /> : <HeaderAuth />}
      </Box>

      {/* Main content with padding to avoid overlap with fixed header */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: "64px", // Bù cho chiều cao của Header
          overflow: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
