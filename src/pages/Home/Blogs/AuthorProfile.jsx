"use client";

import {
  Box,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Mock author data - in real app, this would come from API
const authorData = {
  "doan-truong": {
    name: "Đoàn Trường",
    avatar: "/placeholder.svg?height=120&width=120",
    bio: "Chuyên gia về sức khỏe và các phương pháp bỏ hút thuốc lá. Với hơn 10 năm kinh nghiệm trong lĩnh vực y tế và tâm lý học, tôi đã giúp hơn 500 người bỏ thuốc thành công. Tôi tin rằng mỗi người đều có thể vượt qua cơn nghiện thuốc lá với phương pháp phù hợp và sự hỗ trợ đúng đắn.",
    location: "Hà Nội, Việt Nam",
    joinDate: "2020-01-15",
    specialties: [
      "Sức khỏe",
      "Tâm lý học",
      "Phương pháp bỏ thuốc",
      "Dinh dưỡng",
    ],
    achievements: [
      "Bác sĩ chuyên khoa Nội tổng quát",
      "Chứng chỉ tư vấn tâm lý",
      "Tác giả cuốn sách 'Hành trình bỏ thuốc lá'",
      "Diễn giả tại hơn 50 hội thảo về sức khỏe",
    ],
  },
};

export default function AuthorProfile({
  authorId,
  onPostClick,
  onCategoryClick,
  allPosts,
}) {
  const author = authorData[authorId];

  // Filter posts by author ID
  const authorPosts = allPosts.filter((post) => post.authorId === authorId);

  if (!author) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5">Không tìm thấy tác giả</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Author Header */}
      <Card sx={{ mb: 4, p: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid
            item
            xs={12}
            md={3}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Avatar
              src={author.avatar}
              alt={author.name}
              sx={{
                width: 120,
                height: 120,
                mx: { xs: "auto", md: 0 },
                mb: 2,
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {author.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 1,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {author.location}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Tham gia từ{" "}
                {format(new Date(author.joinDate), "MMMM yyyy", { locale: vi })}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {authorPosts.length} bài viết
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Giới thiệu
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
              {author.bio}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Chuyên môn
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              {author.specialties.map((specialty) => (
                <Chip
                  key={specialty}
                  label={specialty}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Thành tựu
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              {author.achievements.map((achievement, index) => (
                <Typography
                  component="li"
                  variant="body2"
                  key={index}
                  sx={{ mb: 0.5 }}
                >
                  {achievement}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Divider sx={{ mb: 4 }} />

      {/* Author's Posts */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
        Bài viết của {author.name}
      </Typography>

      <Grid container spacing={3}>
        {authorPosts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card
              sx={{
                cursor: "pointer",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                },
              }}
              onClick={() => onPostClick(post)}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt={post.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Chip
                  label={
                    post.category.charAt(0).toUpperCase() +
                    post.category.slice(1)
                  }
                  size="small"
                  color="primary"
                  sx={{ mb: 1, cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick(post.category);
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {format(new Date(post.createdAt), "dd MMM, yyyy", {
                    locale: vi,
                  })}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {authorPosts.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Tác giả chưa có bài viết nào
          </Typography>
        </Box>
      )}
    </>
  );
}
