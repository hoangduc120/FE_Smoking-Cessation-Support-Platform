import { Navigate } from "react-router-dom";
import { PATH } from "../../routes/path";

const ProtectedRoute = ({ children, allowedRoles, allowAnonymous }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));


  if (allowAnonymous) {
    if (currentUser && currentUser.token) {

      return <Navigate to={PATH.HOME} replace />;
    }
    return children;
  }


  if (!currentUser || !currentUser.token) {

    return <Navigate to={PATH.LOGIN} replace />;
  }

  const userRole = currentUser.user?.role?.trim().toLowerCase();
  if (allowedRoles && !allowedRoles.includes(userRole)) {

    return <Navigate to={PATH.HOME} replace />;
  }

  return children;
};

export default ProtectedRoute;