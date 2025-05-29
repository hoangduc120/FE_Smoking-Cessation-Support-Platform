import { useRoutes, Navigate } from "react-router-dom";
import { PATH } from "./path";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import MainLayout from "../layouts/MainLayout/MainLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import CoachLayout from "../layouts/CoachLayout/CoachLayout";
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
import BlogDetail from "../pages/Home/Blogs/BlogDetail";
import SidebarCoach from "../layouts/Sidebar-Coach/SidebarCoach"; // Import the new SidebarCoach
// Placeholder components (create these based on your needs)
import PlanManagementPage from "../pages/Coacher/PlanManagementPage/PlanManagementPage";
import MessagingPage from "../pages/Coacher/MessagingPage/MessagingPage";
import CreateBlog from "../pages/Home/Blogs/CreateBlog";

export default function useRouterElement() {
  const element = useRoutes([
    // AUTH
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: (
            <ProtectedRoute allowAnonymous>
              <LoginPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.REGISTER,
          element: (
            <ProtectedRoute allowAnonymous>
              <RegisterPage />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.FORGOTPASSWORD,
          element: (
            <ProtectedRoute allowAnonymous>
              <ForgotPassWord />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.RESETPASSWORD,
          element: (
            <ProtectedRoute allowAnonymous>
              <ResetPassword />
            </ProtectedRoute>
          ),
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
            <BlogPage />
          ),
        },
        {
          path: PATH.BLOGDETAIL,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <BlogDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: PATH.CREATEBLOG,
          element: (
            <ProtectedRoute allowedRoles={["user", "coach", "admin"]}>
              <CreateBlog />
            </ProtectedRoute>
          ),
        },
      ],
    },
    // COACH
    {
      path: PATH.COACH,
      element: (
        <ProtectedRoute allowedRoles={["coach", "admin"]}>
          <CoachLayout sidebar={<SidebarCoach />} />
        </ProtectedRoute>
      ),
      children: [
        { path: PATH.PLANMANAGEMEMTPAGE, element: <PlanManagementPage /> },
        { path: PATH.COACH_MESSAGING, element: <MessagingPage /> },
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
      children: [{ index: true, element: <DashBoardAdmin /> }],
    },
  ]);
  return element;
}