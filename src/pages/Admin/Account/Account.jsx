import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Input,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  CalendarToday,
  Search,
  FilterList,
  People,
  VerifiedUser,
  Block,
  Edit,
  Visibility,
  ChevronLeft,
  ChevronRight,
  MoreHoriz,
} from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./Account.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../routes/path";
import {
  getAllAccount,
  getDashBoardStart,
} from "../../../store/slices/accountSlice";
import {
  updateAccountStatus,
  updateAccountRole,
} from "../../../store/slices/adminSlice";
import fetcher from "../../../apis/fetcher";
import toast from "react-hot-toast";

const getRoleBadgeColor = (role) => {
  switch (role) {
    case "coach":
      return "primary";
    case "user":
      return "secondary";
    default:
      return "default";
  }
};

const getRoleIcon = (role) => {
  switch (role) {
    case "coach":
      return <VerifiedUser fontSize="small" />;
    case "user":
      return <People fontSize="small" />;
    default:
      return <People fontSize="small" />;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ITEMS_PER_PAGE = 10;

export default function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, dashboardStarts, isLoading, isError } = useSelector(
    (state) => state.account
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(getAllAccount());
    dispatch(getDashBoardStart());
  }, [dispatch]);

  // Lọc bỏ tài khoản admin
  const userData = Array.isArray(account)
    ? account.filter((u) => u.role !== "admin")
    : [];

  const filteredUsers = userData.filter((user) => {
    const matchesSearch =
      user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const stats = {
    total: userData.length,
    coaches: userData.filter((u) => u.role === "coach").length,
    users: userData.filter((u) => u.role === "user").length,
    active: userData.filter((u) => u.isActive).length,
    totalSmokingFreeDays: userData.reduce(
      (sum, u) => sum + (u.smokingFreeDays || 0),
      0
    ),
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1);
    if (filterType === "role") setRoleFilter(value);
    if (filterType === "status") setStatusFilter(value);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleMenuClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleViewDetail = (userId) => {
    navigate(`${PATH.USERDETAIL.replace(":userId", userId)}`);
    handleMenuClose();
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetcher.get("/admin/export/users?format=csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch {
      toast.error("Xuất file thất bại!");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await dispatch(
        updateAccountStatus({ id: userId, isActive: !currentStatus })
      ).unwrap();
      toast.success(
        `Tài khoản đã được ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"} thành công!`
      );
      dispatch(getAllAccount()); // Refresh the account list
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại!");
    }
    handleMenuClose();
  };

  const handleChangeRole = async (userId, currentRole) => {
    const newRole = currentRole === "coach" ? "user" : "coach";
    try {
      await dispatch(updateAccountRole({ id: userId, role: newRole })).unwrap();
      toast.success(
        `Đã thay đổi vai trò thành ${newRole === "coach" ? "Coach" : "Người dùng"}!`
      );
      dispatch(getAllAccount()); // Refresh the account list
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại!");
    }
    handleMenuClose();
  };

  if (isLoading) {
    return (
      <div className="account-container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="account-container">
        <Alert severity="error" style={{ margin: "20px" }}>
          Có lỗi xảy ra khi tải dữ liệu: {isError}
        </Alert>
      </div>
    );
  }

  return (
    <div className="account-container">
      {/* Header */}
      <div className="account-header">
        <div className="account-header-content">
          <div className="account-title-group">
            <Typography variant="h4" className="account-title">
              Quản lý tài khoản
            </Typography>
            <Typography className="account-subtitle">
              Quản lý và theo dõi {stats.total} tài khoản trên nền tảng cai
              thuốc lá
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowDownwardIcon />}
              onClick={handleExportExcel}
              style={{ minWidth: 140 }}
            >
              Export Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Grid container spacing={2} className="account-stats rifles-grid">
        <Grid size={4}>
          <Card className="account-stat-card account-total">
            <CardContent className="account-stat-content">
              <div>
                <Typography className="account-stat-label">Tổng số</Typography>
                <Typography className="account-stat-value">
                  {stats.total}
                </Typography>
              </div>
              <div className="account-stat-icon">
                <People />
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={4}>
          <Card className="account-stat-card account-coach">
            <CardContent className="account-stat-content">
              <div>
                <Typography className="account-stat-label">Coach</Typography>
                <Typography className="account-stat-value">
                  {stats.coaches}
                </Typography>
              </div>
              <div className="account-stat-icon">
                <VerifiedUser />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card className="account-stat-card account-user">
            <CardContent className="account-stat-content">
              <div>
                <Typography className="account-stat-label">
                  Người dùng
                </Typography>
                <Typography className="account-stat-value">
                  {stats.users}
                </Typography>
              </div>
              <div className="account-stat-icon">
                <People />
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card className="account-filter-card">
        <Typography variant="h6" className="account-filter-title">
          <FilterList className="account-icon" />
          Bộ lọc và tìm kiếm
        </Typography>

        <Grid container spacing={2} className="account-filter-content">
          <Grid item size={8} md={6} className="account-search-wrapper">
            <Search className="account-search-icon" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="account-search-input"
              fullWidth
            />
          </Grid>
          <Grid item size={2} md={3}>
            <Select
              value={roleFilter}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="account-filter-select"
              fullWidth
            >
              <MenuItem value="all">Tất cả vai trò</MenuItem>
              <MenuItem value="coach">Coach</MenuItem>
              <MenuItem value="user">Người dùng</MenuItem>
            </Select>
          </Grid>
          <Grid item size={2} md={3}>
            <Select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="account-filter-select"
              fullWidth
            >
              <MenuItem value="all">Tất cả trạng thái</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Card>

      {/* Users Table */}
      <Card className="account-table-card">
        <CardHeader className="account-table-header">
          <div className="account-table-header-content">
            <div>
              <Typography variant="h6" className="account-table-title">
                Danh sách tài khoản
              </Typography>
              <Typography className="account-table-subtitle">
                Hiển thị {paginatedUsers.length} trong tổng số{" "}
                {filteredUsers.length} tài khoản
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardContent className="account-table-content">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="account-table-head-row">
                  <TableCell className="account-table-head-cell">
                    Người dùng
                  </TableCell>
                  <TableCell className="account-table-head-cell">
                    Vai trò
                  </TableCell>
                  <TableCell className="account-table-head-cell">
                    Trạng thái
                  </TableCell>
                  <TableCell className="account-table-head-cell">
                    Ngày tham gia
                  </TableCell>
                  <TableCell className="account-table-head-cell account-table-center">
                    Ngày cai thuốc
                  </TableCell>
                  <TableCell className="account-table-head-cell account-table-right">
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className={`account-table-row account-role-${user.role}`}
                  >
                    <TableCell>
                      <div className="account-user-info">
                        <Avatar className="account-user-avatar">
                          <img
                            src={user.profilePicture || "/placeholder.svg"}
                            alt={user.userName}
                          />
                        </Avatar>
                        <div className="account-user-details">
                          <Typography className="account-user-name">
                            {user.userName}
                          </Typography>
                          <Typography className="account-user-email">
                            {user.email}
                          </Typography>
                          {user.bio && (
                            <Typography className="account-user-bio">
                              {user.bio}
                            </Typography>
                          )}
                          {user.quitReason && (
                            <Typography
                              className="account-user-quit-reason"
                              style={{ fontSize: "0.8rem", color: "#666" }}
                            >
                              Lý do cai thuốc: {user.quitReason}
                            </Typography>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={getRoleBadgeColor(user.role)}
                        className="account-role-badge"
                      >
                        {getRoleIcon(user.role)}
                        {user.role === "coach" ? "Coach" : "Người dùng"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="account-status">
                        <div
                          className={`account-status-dot ${user.isActive ? "account-status-active" : "account-status-inactive"}`}
                        />
                        <Typography
                          className={`account-status-text ${user.isActive ? "account-status-active-text" : "account-status-inactive-text"}`}
                        >
                          {user.isActive ? "Hoạt động" : "Không hoạt động"}
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="account-date">
                        <CalendarToday className="account-icon" />
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="account-table-center">
                      <div className="account-smoking-free">
                        <Typography className="account-smoking-days">
                          {user.smokingFreeDays || 0}
                        </Typography>
                        <Typography className="account-smoking-label">
                          ngày
                        </Typography>
                      </div>
                    </TableCell>
                    <TableCell className="account-table-right">
                      <Button
                        variant="text"
                        className="account-action-btn"
                        onClick={(e) => handleMenuClick(e, user._id)}
                      >
                        <MoreHoriz />
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedUserId === user._id}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MenuItem disabled className="account-menu-item">
                          Hành động
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleViewDetail(user._id)}
                          className="account-menu-item"
                        >
                          <Visibility className="account-icon" />
                          Xem chi tiết
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleChangeRole(user._id, user.role)}
                          className="account-menu-item"
                        >
                          <Edit className="account-icon" />
                          {user.role === "coach"
                            ? "Đặt làm Người dùng"
                            : "Đặt làm Coach"}
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            handleToggleStatus(user._id, user.isActive)
                          }
                          className="account-menu-item account-menu-danger"
                        >
                          <Block className="account-icon" />
                          {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="account-pagination">
              <Typography className="account-pagination-info">
                Hiển thị {startIndex + 1} -{" "}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}{" "}
                trong tổng số {filteredUsers.length} kết quả
              </Typography>
              <div className="account-pagination-controls">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="account-pagination-nav"
                >
                  <ChevronLeft className="account-icon" />
                  Trước
                </Button>
                <div className="account-pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "contained" : "outlined"
                        }
                        size="small"
                        onClick={() => handlePageChange(pageNumber)}
                        className="account-pagination-page"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="account-pagination-nav"
                >
                  Sau
                  <ChevronRight className="account-icon" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
