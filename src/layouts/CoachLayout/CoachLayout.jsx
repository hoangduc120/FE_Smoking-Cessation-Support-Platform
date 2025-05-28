import { Outlet } from "react-router-dom";
import SidebarCoach from "../Sidebar-Coach/SidebarCoach";
import Header from "../../components/Header/Header";
import "./CoachLayout.css"; // New CSS file for layout styles

export default function CoachLayout() {
  return (
    <div className="coach-layout">
      <Header />
      <div className="main-container">
        <SidebarCoach />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}