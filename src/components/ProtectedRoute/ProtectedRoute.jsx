import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser || !currentUser.accessToken) {
    return <Navigate to={PATH.LOGIN} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={PATH.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;