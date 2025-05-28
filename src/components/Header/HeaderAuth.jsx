import { Box, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { PATH } from "../../routes/path";

const HeaderAuth = () => {
  const navigate = useNavigate();
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
        <Link to={PATH.BLOGPAGE} className="nav-link">
          Bài viết
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
          >
            Đăng nhập
          </Link>
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#2e7d32", borderRadius: "8px" }}
        >
          <Link
            to={PATH.REGISTER}
            style={{ color: "white", textDecoration: "none" }}
          >
            Đăng ký
          </Link>
        </Button>
      </Box>
    </Box>
  );
};

export default HeaderAuth;
