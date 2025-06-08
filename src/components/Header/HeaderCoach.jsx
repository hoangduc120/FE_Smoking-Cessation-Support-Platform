import { Box, Typography, Avatar, Menu, MenuItem, Badge } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Bell, MessageSquare } from "lucide-react";
import "./HeaderCoach.css";
import { PATH } from "../../routes/path";
import { logoutApi } from "../../store/slices/authSlice";
import { fetchUser } from "../../store/slices/userSlice";
import toast from "react-hot-toast";

const HeaderCoach = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

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

  const handleChat = () => {
    handleClose();
    navigate(PATH.CHATPAGE);
  };

  const handleRoadmap = () => {
    handleClose();
    navigate(PATH.ROADMAP);
  };

  // Fallback counts if not available in user object
  const unreadNotifications = user?.unreadNotifications || 0;
  const unreadMessages = user?.unreadMessages || 0;

  return (
    <Box className="header-coach">
      <Box className="header-coach__logo">
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
      <Box className="header-coach__actions">
        <Badge
          badgeContent={unreadNotifications}
          color="error"
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={() => navigate(PATH.NOTIFICATIONS)}
        >
          <Bell size={24} color="#2e7d32" />
        </Badge>
        <Badge
          badgeContent={unreadMessages}
          color="error"
          sx={{ mr: 2, cursor: "pointer" }}
          onClick={handleChat}
        >
          <MessageSquare size={24} color="#2e7d32" />
        </Badge>
        <Avatar
          src={user?.profilePicture || ""}
          sx={{ bgcolor: "#2e7d32", cursor: "pointer" }}
          onClick={handleAvatarClick}
        >
          {user?.name?.charAt(0) || "C"}
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
          <MenuItem onClick={handleChat}>Tin nhắn</MenuItem>
          <MenuItem onClick={handleRoadmap}>Bài viết</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default HeaderCoach;
