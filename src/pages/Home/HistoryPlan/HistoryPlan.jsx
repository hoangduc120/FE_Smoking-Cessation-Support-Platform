import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Divider,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Event,
  AccessTime,
  EmojiEvents,
  Person,
  CheckCircle,
  PlayCircle,
  Cancel,
  Description,
  FilterList,
  Search,
  Star,
} from '@mui/icons-material';

// Mock data remains unchanged
const mockData = {
  message: "User plan history fetched successfully",
  status: 200,
  data: {
    planHistory: [
      {
        plan: {
          _id: "68526da4b5208dcd4fe370da",
          coachId: {
            _id: "68356f22b0ed1351aecd262f",
            userName: "Nguyễn Văn Tèo",
            email: "coach1@gmail.com",
          },
          userId: {
            _id: "683d17108df3a6a75db5d20f",
            userName: "Hồ Công Duy",
            email: "user@gmail.com",
          },
          title: "Kế hoạch cai thuốc 30 ngày",
          reason: "Cải thiện sức khỏe và tiết kiệm chi phí",
          image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop",
          startDate: "2024-12-01T07:41:24.365Z",
          endDate: "2024-12-31T07:41:24.365Z",
          duration: 30,
          status: "completed",
          createdAt: "2024-12-01T07:41:24.365Z",
          updatedAt: "2024-12-31T07:41:47.637Z",
        },
        completedStages: 4,
        totalStages: 4,
        completionPercentage: 100,
        badgeCount: 3,
        badges: [
          {
            _id: "badge1",
            name: "Người mới bắt đầu",
            description: "Hoàn thành 7 ngày đầu tiên",
            awardedAt: "2024-12-08T07:41:47.734Z",
          },
          {
            _id: "badge2",
            name: "Kiên trì",
            description: "Hoàn thành 15 ngày liên tiếp",
            awardedAt: "2024-12-16T07:41:47.734Z",
          },
          {
            _id: "badge3",
            name: "Chiến thắng",
            description: "Hoàn thành toàn bộ kế hoạch 30 ngày",
            awardedAt: "2024-12-31T07:41:47.734Z",
          },
        ],
        duration: 30,
      },
      {
        plan: {
          _id: "68526da4b5208dcd4fe370db",
          coachId: {
            _id: "68356f22b0ed1351aecd262g",
            userName: "Trần Thị Mai",
            email: "coach2@gmail.com",
          },
          userId: {
            _id: "683d17108df3a6a75db5d20f",
            userName: "Hồ Công Duy",
            email: "user@gmail.com",
          },
          title: "Kế hoạch cai thuốc nâng cao 60 ngày",
          reason: "Cai thuốc hoàn toàn và xây dựng lối sống lành mạnh",
          image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
          startDate: "2025-01-01T07:41:24.365Z",
          endDate: "2025-03-02T07:41:24.365Z",
          duration: 60,
          status: "ongoing",
          createdAt: "2025-01-01T07:41:24.365Z",
          updatedAt: "2025-01-15T07:41:47.637Z",
        },
        completedStages: 2,
        totalStages: 6,
        completionPercentage: 33,
        badgeCount: 1,
        badges: [
          {
            _id: "badge4",
            name: "Khởi đầu mới",
            description: "Bắt đầu kế hoạch cai thuốc mới",
            awardedAt: "2025-01-01T07:41:47.734Z",
          },
        ],
        duration: 60,
      },
      {
        plan: {
          _id: "68526da4b5208dcd4fe370dc",
          coachId: {
            _id: "68356f22b0ed1351aecd262h",
            userName: "Lê Văn Nam",
            email: "coach3@gmail.com",
          },
          userId: {
            _id: "683d17108df3a6a75db5d20f",
            userName: "Hồ Công Duy",
            email: "user@gmail.com",
          },
          title: "Kế hoạch cai thuốc cấp tốc 14 ngày",
          reason: "Chuẩn bị cho kỳ thi quan trọng",
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
          startDate: "2024-10-01T07:41:24.365Z",
          endDate: "2024-10-15T07:41:24.365Z",
          duration: 14,
          status: "failed",
          createdAt: "2024-10-01T07:41:24.365Z",
          updatedAt: "2024-10-08T07:41:47.637Z",
        },
        completedStages: 1,
        totalStages: 3,
        completionPercentage: 33,
        badgeCount: 1,
        badges: [
          {
            _id: "badge5",
            name: "Nỗ lực",
            description: "Hoàn thành giai đoạn đầu tiên",
            awardedAt: "2024-10-04T07:41:47.734Z",
          },
        ],
        duration: 14,
      },
      {
        plan: {
          _id: "68526da4b5208dcd4fe370dd",
          coachId: {
            _id: "68356f22b0ed1351aecd262i",
            userName: "Phạm Thị Lan",
            email: "coach4@gmail.com",
          },
          userId: {
            _id: "683d17108df3a6a75db5d20f",
            userName: "Hồ Công Duy",
            email: "user@gmail.com",
          },
          title: "Kế hoạch cai thuốc dài hạn 90 ngày",
          reason: "Thay đổi hoàn toàn lối sống và tư duy",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
          startDate: "2024-07-01T07:41:24.365Z",
          endDate: "2024-09-29T07:41:24.365Z",
          duration: 90,
          status: "completed",
          createdAt: "2024-07-01T07:41:24.365Z",
          updatedAt: "2024-09-29T07:41:47.637Z",
        },
        completedStages: 9,
        totalStages: 9,
        completionPercentage: 100,
        badgeCount: 5,
        badges: [
          {
            _id: "badge6",
            name: "Bậc thầy",
            description: "Hoàn thành kế hoạch 90 ngày",
            awardedAt: "2024-09-29T07:41:47.734Z",
          },
          {
            _id: "badge7",
            name: "Kiên định",
            description: "Không hút thuốc trong 30 ngày",
            awardedAt: "2024-07-31T07:41:47.734Z",
          },
          {
            _id: "badge8",
            name: "Vượt khó",
            description: "Vượt qua giai đoạn khó khăn nhất",
            awardedAt: "2024-08-15T07:41:47.734Z",
          },
          {
            _id: "badge9",
            name: "Thành công",
            description: "Hoàn thành 60 ngày liên tiếp",
            awardedAt: "2024-08-30T07:41:47.734Z",
          },
          {
            _id: "badge10",
            name: "Huyền thoại",
            description: "Cai thuốc thành công trong 90 ngày",
            awardedAt: "2024-09-29T07:41:47.734Z",
          },
        ],
        duration: 90,
      },
      {
        plan: {
          _id: "68526da4b5208dcd4fe370de",
          coachId: {
            _id: "68356f22b0ed1351aecd262j",
            userName: "Hoàng Văn Đức",
            email: "coach5@gmail.com",
          },
          userId: {
            _id: "683d17108df3a6a75db5d20f",
            userName: "Hồ Công Duy",
            email: "user@gmail.com",
          },
          title: "Kế hoạch cai thuốc cho người mới",
          reason: "Lần đầu tiên thử cai thuốc",
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
          startDate: "2024-05-01T07:41:24.365Z",
          endDate: "2024-05-08T07:41:24.365Z",
          duration: 7,
          status: "failed",
          createdAt: "2024-05-01T07:41:24.365Z",
          updatedAt: "2024-05-04T07:41:47.637Z",
        },
        completedStages: 0,
        totalStages: 2,
        completionPercentage: 0,
        badgeCount: 0,
        badges: [],
        duration: 7,
      },
    ],
    summary: {
      totalPlans: 5,
      completedPlans: 2,
      ongoingPlans: 1,
      failedPlans: 2,
      templatePlans: 0,
      totalBadges: 10,
    },
  },
  options: {},
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle sx={{ fontSize: 20, color: 'white' }} />;
    case 'ongoing':
      return <PlayCircle sx={{ fontSize: 20, color: 'white' }} />;
    case 'failed':
      return <Cancel sx={{ fontSize: 20, color: 'white' }} />;
    default:
      return <Description sx={{ fontSize: 20, color: 'white' }} />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return { backgroundColor: '#1f9d4b', color: 'white', borderColor: '#1f9d4b' };
    case 'ongoing':
      return { backgroundColor: '#3b82f6', color: 'white', borderColor: '#3b82f6' };
    case 'failed':
      return { backgroundColor: '#ef4444', color: 'white', borderColor: '#ef4444' };
    default:
      return { backgroundColor: '#6b7280', color: 'white', borderColor: '#6b7280' };
  }
};

const getCardHeaderColor = (status) => {
  switch (status) {
    case 'completed':
      return {
        background: 'linear-gradient(to right, #1f9d4b, #16a34a)',
        color: 'white',
      };
    case 'ongoing':
      return {
        background: 'linear-gradient(to right, #3b82f6, #2563eb)',
        color: 'white',
      };
    case 'failed':
      return {
        background: 'linear-gradient(to right, #ef4444, #dc2626)',
        color: 'white',
      };
    default:
      return {
        background: 'linear-gradient(to right, #6b7280, #4b5563)',
        color: 'white',
      };
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed':
      return 'Hoàn thành';
    case 'failed':
      return 'Thất bại';
    default:
      return 'Mẫu';
  }
};

const QuitSmokingHistory = () => {
  const { planHistory, summary } = mockData.data;
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = planHistory.filter((item) => {
    const matchesFilter = filter === 'all' || item.plan.status === filter;
    const matchesSearch =
      item.plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plan.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)',
        padding: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1200, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827' }}>
            Lịch Sử Lộ Trình Cai Thuốc
          </Typography>
          <Typography variant="body1" sx={{ color: '#4b5563' }}>
            Theo dõi hành trình cai thuốc của bạn
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2}>
          {[
            { icon: <Star />, value: summary.totalPlans, label: 'Tổng kế hoạch', color: '#2f70f0' },
            { icon: <CheckCircle />, value: summary.completedPlans, label: 'Hoàn thành', color: '#1f9d4b' },
            { icon: <Cancel />, value: summary.failedPlans, label: 'Thất bại', color: '#ef4444' },
          ].map((item, index) => (
            <Grid item size={4} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: 6 },
                }}
              >
                <CardContent sx={{ padding: 2 }}>
                  <Box sx={{ color: item.color, marginBottom: 1 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: item.color }}>
                    {item.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#4b5563' }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters and Search */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', justifyContent:"space-between"}}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList sx={{ color: '#4b5563' }} />
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151' }}>
             
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { label: 'Tất cả', value: 'all', color: '#1f9d4b' },
                { label: 'Hoàn thành', value: 'completed', color: '#1f9d4b' },
                { label: 'Thất bại', value: 'failed', color: '#ef4444' },
              ].map((btn) => (
                <Button
                  key={btn.value}
                  variant={filter === btn.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setFilter(btn.value)}
                  sx={{
                    backgroundColor: filter === btn.value ? btn.color : 'transparent',
                    color: filter === btn.value ? 'white' : btn.color,
                    borderColor: btn.color,
                    '&:hover': {
                      backgroundColor: filter === btn.value ? btn.color : `${btn.color}33`,
                    },
                  }}
                >
                  {btn.label}
                </Button>
              ))}
            </Box>
          </Box>
          <TextField
            size="small"
            placeholder="Tìm kiếm kế hoạch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#9ca3af' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', md: 200 } }}
          />
        </Box>

        {/* Results count */}
        <Typography variant="body2" sx={{ color: '#4b5563' }}>
          Hiển thị {filteredPlans.length} trong tổng số {planHistory.length} kế hoạch
        </Typography>

        {/* Plan History */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredPlans.map((item) => (
            <Card
              key={item.plan._id}
              sx={{
                overflow: 'hidden',
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { transform: 'scale(1.02)', boxShadow: 6 },
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getStatusIcon(item.plan.status)}
                    <Box>
                      <Typography variant="h6">{item.plan.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        {item.plan.reason}
                      </Typography>
                    </Box>
                  </Box>
                }
                action={
                  <Chip
                    label={getStatusText(item.plan.status)}
                    sx={{ ...getStatusColor(item.plan.status), fontWeight: 'medium' }}
                  />
                }
                sx={{ ...getCardHeaderColor(item.plan.status), padding: 2 }}
              />
              <CardContent sx={{ padding: 3 }}>
                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item size={6} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Plan Image */}
                      <Box sx={{ position: 'relative', height: 192, borderRadius: 1, overflow: 'hidden' }}>
                        <img
                          src={item.plan.image || '/placeholder.svg?height=200&width=300'}
                          alt={item.plan.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                      {/* Coach Info */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          padding: 1,
                          backgroundColor: '#f3f4f6',
                          borderRadius: 1,
                        }}
                      >
                        <Person sx={{ color: '#6b7280' }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#111827' }}>
                            Huấn luyện viên
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#4b5563' }}>
                            {item.plan.coachId.userName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {item.plan.coachId.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  {/* Right Column */}
                  <Grid item size={6} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Progress */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#374151' }}>
                            Tiến độ hoàn thành
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 'bold',
                              color:
                                item.plan.status === 'completed'
                                  ? '#1f9d4b'
                                  : item.plan.status === 'ongoing'
                                  ? '#3b82f6'
                                  : '#ef4444',
                            }}
                          >
                            {item.completionPercentage}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.completionPercentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {item.completedStages}/{item.totalStages} giai đoạn hoàn thành
                        </Typography>
                      </Box>
                      <Divider />
                      {/* Timeline */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Event sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Ngày bắt đầu:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            {formatDate(item.plan.startDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Event sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Ngày kết thúc:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            {formatDate(item.plan.endDate)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTime sx={{ fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            Thời gian:
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#4b5563' }}>
                            {item.duration} ngày
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />
                      {/* Badges */}
                      {item.badges.length > 0 ? (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                            <EmojiEvents sx={{ color: '#eab308' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#111827' }}>
                              Huy hiệu đạt được ({item.badgeCount})
                            </Typography>
                          </Box>
                          <Box sx={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {item.badges.map((badge) => (
                              <Box
                                key={badge._id}
                                sx={{
                                  display: 'flex',
                                  gap: 1,
                                  padding: 1,
                                  backgroundColor: '#fefce8',
                                  border: '1px solid #fef08a',
                                  borderRadius: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    backgroundColor: '#fefce8',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <EmojiEvents sx={{ color: '#a16207' }} />
                                </Box>
                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#854d0e' }}>
                                    {badge.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: '#713f12', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                                  >
                                    {badge.description}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#a16207' }}>
                                    Đạt được: {formatDate(badge.awardedAt)}
                                  </Typography>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', padding: 2, color: '#6b7280' }}>
                          <EmojiEvents sx={{ fontSize: 32, color: '#9ca3af', marginBottom: 1 }} />
                          <Typography variant="body2">Chưa có huy hiệu nào</Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          {filteredPlans.length === 0 && (
            <Card sx={{ textAlign: 'center', padding: 6 }}>
              <Star sx={{ fontSize: 64, color: '#9ca3af', marginBottom: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium', color: '#111827', marginBottom: 1 }}>
                Không tìm thấy kế hoạch nào
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563' }}>
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả khác.
              </Typography>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuitSmokingHistory;