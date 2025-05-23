import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Header.css";
import { PATH } from "../../routes/path";
import { logoutApi } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <Box className="header">
      <Box className="header-logo">
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2e7d32" }}>
          <span role="img" aria-label="leaf">
            🌿
          </span>{" "}
          QuitSmoke
        </Typography>
      </Box>
      <Box className="header-nav">
        <Link to="/" className="nav-link">
          Trang chủ
        </Link>
        <Link to="/about" className="nav-link">
          Về chúng tôi
        </Link>
        <Link to="/benefits" className="nav-link">
          Lợi ích cai thuốc
        </Link>
        <Link to="/resources" className="nav-link">
          Tài nguyên
        </Link>
        <Link to="/contact" className="nav-link">
          Liên hệ
        </Link>
      </Box>
      <Box className="header-actions">
        <Button
          variant="contained"
          sx={{ backgroundColor: "#2e7d32", borderRadius: "8px", mr: 1 }}
        >
          <Link
            to={PATH.LOGIN}
            style={{ color: "white", textDecoration: "none" }}
            onClick={handleLogout} // Sửa thành onClick={handleLogout}
          >
            Đăng xuất
          </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
