import {
  Box,
  Button,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaFacebookMessenger } from "react-icons/fa";
import "./Header.css";
import { PATH } from "../../routes/path";
import { logoutApi } from "../../store/slices/authSlice";
import toast from "react-hot-toast";
import { fetchUser } from "../../store/slices/userSlice";
import { fetchUserMembership } from "../../store/slices/userMembershipSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { userMembershipData } = useSelector((state) => state.userMembership);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserMembership(user._id));
    }
  }, [dispatch, user?._id]);
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

  const handleBlog = () => {
    handleClose();
    if (user?._id) {
      navigate(`/author/${user._id}`);
    } else {
      toast.error("Vui lòng đăng nhập để xem bài viết của bạn!");
      navigate(PATH.LOGIN);
    }
  };

  const handleRoadmap = () => {
    handleClose();
    navigate(PATH.ROADMAP);
  };
  const handlePaymentHistory = () => {
    handleClose();
    navigate(PATH.PAYMENTHISTORY);
  };

  const handleHistoryPlan = () => {
    handleClose();
    navigate(PATH.HISTORYPLAN);
  };
  const isPremiumUser = userMembershipData?.currentPlan?.name === "Premium";
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
        <Link to={PATH.BLOGPAGE} className="nav-link">
          Bài viết
        </Link>
        <Link to={PATH.UPGRADEMEMBER} className="nav-link">
          Gói Thành Viên
        </Link>
        {isPremiumUser && (
          <Link to={PATH.CUSTOMQUITPLAN} className="nav-link">
            Kế hoạch cá nhân
          </Link>
        )}
        <Link to={PATH.BENEFIT} className="nav-link">
          Lợi ích cai thuốc
        </Link>
        <Link to={PATH.ABOUTUS} className="nav-link">
          Về chúng tôi
        </Link>
      </Box>
      <Box
        className="header-actions"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <IconButton
          onClick={handleChat}
          sx={{ color: "#2e7d32", mr: 1 }}
          aria-label="messenger"
        >
          <FaFacebookMessenger />
        </IconButton>
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
          <MenuItem onClick={handleProfile}> Hồ sơ</MenuItem>
          <MenuItem onClick={handleRoadmap}>Lộ trình</MenuItem>
          <MenuItem onClick={handleBlog}>Bài viết của tôi</MenuItem>
          <MenuItem onClick={handleHistoryPlan}>Lịch sử lộ trình</MenuItem>
          <MenuItem onClick={handlePaymentHistory}>Lịch sử thanh toán</MenuItem>
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;
