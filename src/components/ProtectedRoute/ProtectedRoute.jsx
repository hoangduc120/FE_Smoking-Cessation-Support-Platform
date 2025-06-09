import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { memo } from "react";
import { getCurrentUser, isAuthenticated, getUserRole, getRedirectPath } from "../../utils/authUtils";

const ProtectedRoute = memo(({ children, allowedRoles, allowAnonymous }) => {
  const currentUser = getCurrentUser();

  // Nếu trang cho phép truy cập ẩn danh (như trang đăng nhập)
  if (allowAnonymous) {
    if (isAuthenticated()) {
      const userRole = getUserRole();
      console.log("Chuyển hướng theo vai trò: Người dùng đã đăng nhập");
      const redirectPath = getRedirectPath(userRole);
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  }

  if (!isAuthenticated()) {
    console.log("Chuyển hướng đến LOGIN: Không có người dùng hoặc token");
    return <Navigate to={PATH.LOGIN} replace />;
  }

  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Chuyển hướng đến trang phù hợp: Vai trò không được phép");
    const redirectPath = getRedirectPath(userRole);
    return <Navigate to={redirectPath} replace />;
  }

  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;
