import React, { useEffect, useState } from 'react';
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
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { useDispatch, useSelector } from 'react-redux';
import { histotyPlan } from '../../../store/slices/planeSlice';



const getStatusIcon = (status) => {
  switch (status) {
    case 'completed':
      return <CheckCircle sx={{ fontSize: 20, color: 'white' }} />;
    case 'ongoing':
      return <PlayCircleOutlineIcon sx={{ fontSize: 20, color: 'white' }} />;
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
      case 'ongoing':
        return 'Đang diễn ra';
    case 'failed':
      return 'Thất bại';
    default:
      return 'Mẫu';
  }
};

const QuitSmokingHistory = () => {

  const dispatch = useDispatch()
  const {plan, isLoading, isError} = useSelector((state) => state.plan)
  console.log("plan histoty", plan)

  const summaryHistory = plan?.summary

const historyData = plan?.planHistory
console.log("historyData",historyData)

  useEffect(() => {
    dispatch(histotyPlan())
  }, [])

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = historyData?.filter((item) => {
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
            { icon: <Star />, value: summaryHistory?.totalPlans, label: 'Tổng kế hoạch', color: '#b98937' },
            { icon: <CheckCircle />, value: summaryHistory?.completedPlans, label: 'Hoàn thành', color: '#1f9d4b' },
            { icon: <PlayCircleOutlineIcon />, value: summaryHistory?.ongoingPlans, label: 'Đang diễn ra', color: '#3c67e5' },
            { icon: <Cancel />, value: summaryHistory?.failedPlans, label: 'Thất bại', color: '#ef4444' },
          ].map((item, index) => (
            <Grid item size={3} key={index}>
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
                { label: 'Đang diễn ra', value: 'ongoing', color: '#3c67e5' },
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
          Hiển thị {filteredPlans?.length} trong tổng số {historyData?.length} kế hoạch
        </Typography>

        {/* Plan History */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredPlans?.map((item) => (
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
          {filteredPlans?.length === 0 && (
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