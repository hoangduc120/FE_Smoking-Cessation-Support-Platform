import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import LoginPage from "../pages/Auth/Login/LoginPage";
import RegisterPage from "../pages/Auth/Register/RegisterPage";
import HomePage from "../pages/Home/HomePage/HomePage";
import CoachesPage from "../pages/Coacher/CoachesPage/CoachesPage";
import DashBoardAdmin from "../pages/Admin/DashBoard/DashBoardAdmin";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import UpgradeMember from "../pages/Home/UpgradeMember/UpgradeMember";
import AssessmentPage from "../pages/Home/AsseementPage/AssessmentPage";

export default function useRouterElement() {
  const element = useRoutes([
    // AUTH
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: <LoginPage />,
        },
        {
          path: PATH.REGISTER,
          element: <RegisterPage />,
        },
      ],
    },
    // HOMEPAGE
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: PATH.ASSESSMENTPAGE,
          element: <AssessmentPage />,
        },
          {
          path: PATH.UPGRADEMEMBER,
          element: <UpgradeMember />,
        },
      ],
    },

    // COACHES
    {
      path: PATH.COACHES,
      element: (
        <ProtectedRoute allowedRoles={["user", "admin"]}>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <CoachesPage />,
        },
        {},
      ],
    },

    // ADMIN
    {
      path: PATH.ADMIN,
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashBoardAdmin />,
        },
      ],
    },
  ]);
  return element;
}
