import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";

const ProtectedRoute = ({ children, allowedRoles, allowAnonymous }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Nếu trang cho phép truy cập ẩn danh (như trang đăng nhập)
  if (allowAnonymous) {
    if (currentUser && currentUser.token) {
      const userRole = currentUser.user?.role?.trim().toLowerCase();
      console.log("Chuyển hướng theo vai trò: Người dùng đã đăng nhập");

      // Chuyển hướng theo vai trò
      if (userRole === "user") {
        return <Navigate to={PATH.HOME} replace />;
      } else if (userRole === "coach") {
        return <Navigate to={PATH.PLANMANAGEMEMTPAGE} replace />;
      } else if (userRole === "admin" || userRole === "administrator") {
        return <Navigate to={PATH.ADMIN} replace />;
      } else {
        return <Navigate to={PATH.HOME} replace />;
      }
    }

    return children;
  }

  if (!currentUser || !currentUser.token) {
    console.log("Chuyển hướng đến LOGIN: Không có người dùng hoặc token");
    return <Navigate to={PATH.LOGIN} replace />;
  }

  const userRole = currentUser.user?.role?.trim().toLowerCase();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Chuyển hướng đến trang phù hợp: Vai trò không được phép");
    // Chuyển hướng theo vai trò
    if (userRole === "user") {
      return <Navigate to={PATH.HOME} replace />;
    } else if (userRole === "coach") {
      return <Navigate to={PATH.PLANMANAGEMEMTPAGE} replace />;
    } else if (userRole === "admin" || userRole === "administrator") {
      return <Navigate to={PATH.ADMIN} replace />;
    } else {
      return <Navigate to={PATH.HOME} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
