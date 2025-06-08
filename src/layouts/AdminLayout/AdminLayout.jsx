import { Outlet } from "react-router-dom";
// import HeaderCoach from "../../components/Header/HeaderCoach";
import "./AdminLayout.css";
import SidebarAdmin from "../SidebarAdmin/SidebarAdmin";

export default function AdminLayout() {
  return (
    <div className="coach-layout">
      {/* <HeaderCoach /> */}
      <div className="main-container">
        <SidebarAdmin />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
