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
import PlanCustomization from "../pages/Home/PlanCustomization/PlanCustomization";

import ForgotPassWord from "../pages/Auth/ForgetPassWord/ForgotPassWord";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";
import Profile from "../pages/Auth/Profile/Profile";
import CoachPlane from "../pages/Home/CoachPlane/CoachPlane";
import CoachPlaneDetail from "../pages/Home/CoachPlane/CoachPlaneDetail";
import BlogPage from "../pages/Home/Blogs/BlogPage";
import PostDetail from "../pages/Home/Blogs/PostDetail";

export default function useRouterElement() {
  const element = useRoutes([
    // AUTH
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        { path: PATH.LOGIN, element: <LoginPage /> },
        { path: PATH.REGISTER, element: <RegisterPage /> },
        { path: PATH.FORGOTPASSWORD, element: <ForgotPassWord /> },
        { path: PATH.RESETPASSWORD, element: <ResetPassword /> },
      ],
    },
    // HOMEPAGE
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />, // Công khai
        },
        {
          path: PATH.ASSESSMENTPAGE,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <AssessmentPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.UPGRADEMEMBER,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <UpgradeMember />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.PLANCUSTOMIZATION,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <PlanCustomization />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.COASHPLANE,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <CoachPlane />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.COACHPLANEDETAIL,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <CoachPlaneDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.PROFILE,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.BLOGPAGE,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <BlogPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.POSTDETAIL,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <PostDetail />
            </ProtectedRoute>
          ),
        },
      ],
    },
    // COACHES
    {
      path: PATH.COACHES,
      element: (
        <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <CoachesPage /> }],
    },
    // ADMIN
    {
      path: PATH.ADMIN,
      element: (
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [{ index: true, element: <DashBoardAdmin /> }],
    },
  ]);
  return element;
}
