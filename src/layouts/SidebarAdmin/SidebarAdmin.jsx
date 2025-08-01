import { MessageSquare, Calendar, Settings, Menu, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import StairsIcon from "@mui/icons-material/Stairs";
import WalletIcon from "@mui/icons-material/Wallet";
import InventoryIcon from "@mui/icons-material/Inventory";
import "../Sidebar-Coach/SidebarCoach.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/slices/userSlice";
import { logoutApi } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { PATH } from "../../routes/path";

const SIDEBAR_ITEMS = [
  {
    name: "Dashboard",
    icon: StairsIcon,
    color: "#6EE7B7",
    href: "/admin",
  },
  {
    name: "Account",
    icon: MessageSquare,
    color: "#EC4899",
    href: "/admin/account",
  },
  {
    name: "Transition ",
    icon: WalletIcon,
    color: "#6967ac",
    href: "/admin/transition",
  },
  {
    name: "Package ",
    icon: InventoryIcon,
    color: "#1d39edff",
    href: "/admin/package",
  },
];

const SidebarAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutApi())
      .unwrap()
      .then(() => {
        toast.success("Đăng xuất thành công");
        localStorage.removeItem("currentUser");
        navigate(PATH.LOGIN);
      })
      .catch((error) => {
        const errorMessage =
          error.message || "Đăng xuất thất bại, vui lòng thử lại.";
        toast.error(errorMessage);
        localStorage.removeItem("currentUser");
        navigate(PATH.LOGIN);
      });
  };

  // Fallback to "Coach" if user or user.name is undefined
  const coachName = user?.userName || "Coach";

  return (
    <motion.div
      className={`sidebar ${isSidebarOpen ? "sidebar--open" : "sidebar--closed"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="sidebar__content">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="sidebar__toggle-button"
        >
          <Menu size={24} />
        </motion.button>

        {/* Greeting Section */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="sidebar__greeting"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Link to={PATH.PROFILECOACH} className="sidebar__greeting-text">
                Xin chào {coachName}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="sidebar__nav-menu">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="sidebar__nav-item">
                <item.icon
                  size={20}
                  className="sidebar__nav-icon"
                  style={{ color: item.color }}
                />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="sidebar__nav-text"
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

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="sidebar__logout-button"
        >
          <LogOut
            size={20}
            className="sidebar__nav-icon"
            style={{ color: "#EF4444" }}
          />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="sidebar__nav-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SidebarAdmin;
