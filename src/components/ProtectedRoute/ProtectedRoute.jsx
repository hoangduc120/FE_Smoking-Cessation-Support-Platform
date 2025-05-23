import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.token) {
    console.log("Chuyển hướng đến LOGIN: Không có người dùng hoặc token");
    return <Navigate to={PATH.LOGIN} replace />;
  }
  if (
    allowedRoles &&
    !allowedRoles.includes(currentUser.user?.role?.trim().toLowerCase())
  ) {
    console.log("Chuyển hướng đến HOME: Vai trò không được phép");
    return <Navigate to={PATH.HOME} replace />;
  }
  return children;
};

export default ProtectedRoute;
