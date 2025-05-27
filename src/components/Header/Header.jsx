import { Box, Button, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "./Header.css";
import { PATH } from "../../routes/path";
import { logoutApi } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  console.log("auth", user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
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

  const handleProfile = () => {
    handleClose();
    navigate(PATH.PROFILE);
  };

  const handleRoadmap = () => {
    handleClose();
    navigate(PATH.ROADMAP);
  };

  return (
    <Box className="header">
      <Box className="header-logo">
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#2e7d32", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
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
        <Avatar
          src={user?.profilePicture || ""}
          sx={{ bgcolor: "#2e7d32", cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          U
        </Avatar>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleProfile}>Hồ sơ</MenuItem>
          <MenuItem onClick={handleRoadmap}>Lộ trình</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
