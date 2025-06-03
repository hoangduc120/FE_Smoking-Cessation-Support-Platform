import { MessageSquare, Calendar, Users, Settings, Menu } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import StairsIcon from '@mui/icons-material/Stairs';
import "./SidebarCoach.css";

const SIDEBAR_COACH_ITEMS = [
  {
    name: "Plan Management",
    icon: Calendar,
    color: "#6366f1",
    href: "/coach/plan-management",
  },
  {
    name: "Messaging",
    icon: MessageSquare,
    color: "#EC4899",
    href: "/coach/messaging",
  },
  {
    name: "Quit Plan Stage",
    icon: StairsIcon,
    color: "#10B981",
    href: "/coach/planStage",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "#6EE7B7",
    href: "/coach/settings",
  },
];

const SidebarCoach = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <motion.div
      className={`sidebar-coach-container ${isSidebarOpen ? "open" : "closed"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="sidebar-coach-content">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="toggle-button"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="nav-menu">
          {SIDEBAR_COACH_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="nav-item">
                <item.icon
                  size={20}
                  className="nav-icon"
                  style={{ color: item.color }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="nav-text"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default SidebarCoach;