import { Outlet } from "react-router-dom";
import SidebarCoach from "../Sidebar-Coach/SidebarCoach";
import HeaderCoach from "../../components/Header/HeaderCoach";
import "./CoachLayout.css"; // New CSS file for layout styles

export default function CoachLayout() {
  return (
    <div className="coach-layout">
      <HeaderCoach />
      <div className="main-container">
        <SidebarCoach />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
