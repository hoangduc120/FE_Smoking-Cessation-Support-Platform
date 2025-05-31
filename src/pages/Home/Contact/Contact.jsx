// "use client";

// import { useState } from "react";
// import {
//   Container,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   Grid,
//   TextField,
//   Button,
//   Paper,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Divider,
//   Alert,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import {
//   Phone,
//   Email,
//   LocationOn,
//   Schedule,
//   Send,
//   Support,
//   Emergency,
//   Group,
//   LocalHospital,
// } from "@mui/icons-material";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//     urgency: "normal",
//     newsletter: false,
//   });
//   const [showSuccess, setShowSuccess] = useState(false);

//   const handleInputChange = (event) => {
//     const { name, value, checked } = event.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "newsletter" ? checked : value,
//     }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     // Simulate form submission
//     setShowSuccess(true);
//     setTimeout(() => setShowSuccess(false), 5000);
//     // Reset form
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       subject: "",
//       message: "",
//       urgency: "normal",
//       newsletter: false,
//     });
//   };

//   const contactInfo = [
//     {
//       icon: <Phone sx={{ color: "#4CAF50", fontSize: 30 }} />,
//       title: "Điện thoại",
//       details: [
//         "Hotline 24/7: 1800-QUIT-NOW",
//         "Tư vấn: (028) 3456-7890",
//         "Khẩn cấp: (028) 3456-7891",
//       ],
//     },
//     {
//       icon: <Email sx={{ color: "#4CAF50", fontSize: 30 }} />,
//       title: "Email",
//       details: [
//         "Tổng đài: support@quitsmoke.vn",
//         "Tư vấn: advice@quitsmoke.vn",
//         "Hợp tác: partner@quitsmoke.vn",
//       ],
//     },
//     {
//       icon: <LocationOn sx={{ color: "#4CAF50", fontSize: 30 }} />,
//       title: "Địa chỉ",
//       details: [
//         "Trụ sở chính:",
//         "123 Đường Sức Khỏe, Quận 1",
//         "TP. Hồ Chí Minh, Việt Nam",
//       ],
//     },
//     {
//       icon: <Schedule sx={{ color: "#4CAF50", fontSize: 30 }} />,
//       title: "Giờ làm việc",
//       details: [
//         "Thứ 2 - Thứ 6: 8:00 - 18:00",
//         "Thứ 7: 8:00 - 12:00",
//         "Chủ nhật: Hotline 24/7",
//       ],
//     },
//   ];

//   const services = [
//     {
//       icon: <Support sx={{ color: "#4CAF50" }} />,
//       title: "Tư vấn cá nhân",
//       description: "Tư vấn 1-1 với chuyên gia tâm lý và y tế",
//     },
//     {
//       icon: <Group sx={{ color: "#4CAF50" }} />,
//       title: "Nhóm hỗ trợ",
//       description: "Tham gia cộng đồng người cai thuốc lá",
//     },
//     {
//       icon: <LocalHospital sx={{ color: "#4CAF50" }} />,
//       title: "Khám sức khỏe",
//       description: "Kiểm tra sức khỏe định kỳ trong quá trình cai thuốc",
//     },
//     {
//       icon: <Emergency sx={{ color: "#4CAF50" }} />,
//       title: "Hỗ trợ khẩn cấp",
//       description: "Hỗ trợ 24/7 khi bạn gặp khó khăn",
//     },
//   ];

//   const locations = [
//     {
//       name: "Chi nhánh Hà Nội",
//       address: "456 Phố Khỏe Mạnh, Hoàn Kiếm, Hà Nội",
//       phone: "(024) 3456-7890",
//     },
//     {
//       name: "Chi nhánh Đà Nẵng",
//       address: "789 Đường Tươi Mới, Hải Châu, Đà Nẵng",
//       phone: "(0236) 3456-7890",
//     },
//     {
//       name: "Chi nhánh Cần Thơ",
//       address: "321 Đường Xanh, Ninh Kiều, Cần Thơ",
//       phone: "(0292) 3456-7890",
//     },
//   ];

//   return (
//     <Box sx={{ backgroundColor: "#E8F5E8", minHeight: "100vh", py: 4 }}>
//       <Container maxWidth="lg">
//         {/* Header */}
//         <Box sx={{ textAlign: "center", mb: 6 }}>
//           <Typography
//             variant="h2"
//             component="h1"
//             sx={{
//               color: "#1B5E20",
//               fontWeight: "bold",
//               mb: 2,
//               fontSize: { xs: "2rem", md: "3rem" },
//             }}
//           >
//             Liên Hệ Với Chúng Tôi
//           </Typography>
//           <Typography
//             variant="h5"
//             sx={{
//               color: "#2E7D32",
//               mb: 4,
//               fontSize: { xs: "1.2rem", md: "1.5rem" },
//             }}
//           >
//             Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình cai thuốc lá
//           </Typography>
//         </Box>

//         {/* Success Alert */}
//         {showSuccess && (
//           <Alert
//             severity="success"
//             sx={{ mb: 4, backgroundColor: "#C8E6C9", color: "#1B5E20" }}
//           >
//             Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
//           </Alert>
//         )}

//         <Grid container spacing={4}>
//           {/* Contact Form */}
//           <Grid item xs={12} md={8}>
//             <Paper elevation={3} sx={{ p: 4, backgroundColor: "#F1F8E9" }}>
//               <Typography
//                 variant="h4"
//                 sx={{ color: "#1B5E20", mb: 3, fontWeight: "bold" }}
//               >
//                 Gửi Tin Nhắn
//               </Typography>
//               <Box component="form" onSubmit={handleSubmit}>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Họ và tên"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#A5D6A7" },
//                           "&:hover fieldset": { borderColor: "#4CAF50" },
//                           "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//                         },
//                         "& .MuiInputLabel-root.Mui-focused": {
//                           color: "#4CAF50",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Email"
//                       name="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       required
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#A5D6A7" },
//                           "&:hover fieldset": { borderColor: "#4CAF50" },
//                           "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//                         },
//                         "& .MuiInputLabel-root.Mui-focused": {
//                           color: "#4CAF50",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <TextField
//                       fullWidth
//                       label="Số điện thoại"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#A5D6A7" },
//                           "&:hover fieldset": { borderColor: "#4CAF50" },
//                           "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//                         },
//                         "& .MuiInputLabel-root.Mui-focused": {
//                           color: "#4CAF50",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} sm={6}>
//                     <FormControl fullWidth>
//                       <InputLabel
//                         sx={{ "&.Mui-focused": { color: "#4CAF50" } }}
//                       >
//                         Mức độ ưu tiên
//                       </InputLabel>
//                       <Select
//                         name="urgency"
//                         value={formData.urgency}
//                         onChange={handleInputChange}
//                         label="Mức độ ưu tiên"
//                         sx={{
//                           "& .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#A5D6A7",
//                           },
//                           "&:hover .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#4CAF50",
//                           },
//                           "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
//                             borderColor: "#4CAF50",
//                           },
//                         }}
//                       >
//                         <MenuItem value="low">Thấp</MenuItem>
//                         <MenuItem value="normal">Bình thường</MenuItem>
//                         <MenuItem value="high">Cao</MenuItem>
//                         <MenuItem value="urgent">Khẩn cấp</MenuItem>
//                       </Select>
//                     </FormControl>
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Chủ đề"
//                       name="subject"
//                       value={formData.subject}
//                       onChange={handleInputChange}
//                       required
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#A5D6A7" },
//                           "&:hover fieldset": { borderColor: "#4CAF50" },
//                           "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//                         },
//                         "& .MuiInputLabel-root.Mui-focused": {
//                           color: "#4CAF50",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <TextField
//                       fullWidth
//                       label="Tin nhắn"
//                       name="message"
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       multiline
//                       rows={4}
//                       required
//                       sx={{
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": { borderColor: "#A5D6A7" },
//                           "&:hover fieldset": { borderColor: "#4CAF50" },
//                           "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
//                         },
//                         "& .MuiInputLabel-root.Mui-focused": {
//                           color: "#4CAF50",
//                         },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <FormControlLabel
//                       control={
//                         <Checkbox
//                           name="newsletter"
//                           checked={formData.newsletter}
//                           onChange={handleInputChange}
//                           sx={{
//                             color: "#4CAF50",
//                             "&.Mui-checked": { color: "#4CAF50" },
//                           }}
//                         />
//                       }
//                       label="Đăng ký nhận bản tin về cai thuốc lá"
//                       sx={{
//                         "& .MuiFormControlLabel-label": { color: "#2E7D32" },
//                       }}
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       size="large"
//                       startIcon={<Send />}
//                       sx={{
//                         backgroundColor: "#4CAF50",
//                         "&:hover": { backgroundColor: "#45A049" },
//                         py: 1.5,
//                         px: 4,
//                       }}
//                     >
//                       Gửi Tin Nhắn
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </Box>
//             </Paper>
//           </Grid>

//           {/* Contact Information */}
//           <Grid item xs={12} md={4}>
//             <Paper
//               elevation={3}
//               sx={{ p: 3, backgroundColor: "#F1F8E9", mb: 3 }}
//             >
//               <Typography
//                 variant="h5"
//                 sx={{ color: "#1B5E20", mb: 3, fontWeight: "bold" }}
//               >
//                 Thông Tin Liên Hệ
//               </Typography>
//               {contactInfo.map((info, index) => (
//                 <Box key={index} sx={{ mb: 3 }}>
//                   <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
//                     {info.icon}
//                     <Typography
//                       variant="h6"
//                       sx={{ color: "#1B5E20", ml: 2, fontWeight: "bold" }}
//                     >
//                       {info.title}
//                     </Typography>
//                   </Box>
//                   {info.details.map((detail, detailIndex) => (
//                     <Typography
//                       key={detailIndex}
//                       variant="body2"
//                       sx={{ color: "#2E7D32", ml: 5 }}
//                     >
//                       {detail}
//                     </Typography>
//                   ))}
//                   {index < contactInfo.length - 1 && (
//                     <Divider sx={{ mt: 2, backgroundColor: "#A5D6A7" }} />
//                   )}
//                 </Box>
//               ))}
//             </Paper>

//             {/* Services */}
//             <Paper elevation={3} sx={{ p: 3, backgroundColor: "#F1F8E9" }}>
//               <Typography
//                 variant="h5"
//                 sx={{ color: "#1B5E20", mb: 3, fontWeight: "bold" }}
//               >
//                 Dịch Vụ Của Chúng Tôi
//               </Typography>
//               <List>
//                 {services.map((service, index) => (
//                   <ListItem key={index} sx={{ px: 0 }}>
//                     <ListItemIcon>{service.icon}</ListItemIcon>
//                     <ListItemText
//                       primary={
//                         <Typography
//                           variant="subtitle1"
//                           sx={{ color: "#1B5E20", fontWeight: "bold" }}
//                         >
//                           {service.title}
//                         </Typography>
//                       }
//                       secondary={
//                         <Typography variant="body2" sx={{ color: "#2E7D32" }}>
//                           {service.description}
//                         </Typography>
//                       }
//                     />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>
//         </Grid>

//         {/* Locations */}
//         <Box sx={{ mt: 6 }}>
//           <Typography
//             variant="h4"
//             sx={{
//               color: "#1B5E20",
//               textAlign: "center",
//               mb: 4,
//               fontWeight: "bold",
//             }}
//           >
//             Chi Nhánh Trên Toàn Quốc
//           </Typography>
//           <Grid container spacing={3}>
//             {locations.map((location, index) => (
//               <Grid item xs={12} md={4} key={index}>
//                 <Card
//                   sx={{
//                     backgroundColor: "#F1F8E9",
//                     border: "2px solid #A5D6A7",
//                     "&:hover": {
//                       transform: "translateY(-5px)",
//                       transition: "transform 0.3s ease-in-out",
//                     },
//                   }}
//                 >
//                   <CardContent>
//                     <Typography
//                       variant="h6"
//                       sx={{ color: "#1B5E20", mb: 2, fontWeight: "bold" }}
//                     >
//                       {location.name}
//                     </Typography>
//                     <Box
//                       sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
//                     >
//                       <LocationOn sx={{ color: "#4CAF50", mr: 1, mt: 0.5 }} />
//                       <Typography variant="body2" sx={{ color: "#2E7D32" }}>
//                         {location.address}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", alignItems: "center" }}>
//                       <Phone sx={{ color: "#4CAF50", mr: 1 }} />
//                       <Typography variant="body2" sx={{ color: "#2E7D32" }}>
//                         {location.phone}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>

//         {/* Emergency Contact */}
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             mt: 6,
//             backgroundColor: "#4CAF50",
//             color: "white",
//             textAlign: "center",
//           }}
//         >
//           <Emergency sx={{ fontSize: 50, mb: 2 }} />
//           <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
//             Cần Hỗ Trợ Khẩn Cấp?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 3 }}>
//             Đường dây nóng 24/7 luôn sẵn sàng hỗ trợ bạn
//           </Typography>
//           <Typography variant="h3" sx={{ fontWeight: "bold" }}>
//             1800-QUIT-NOW
//           </Typography>
//         </Paper>
//       </Container>
//     </Box>
//   );
// };

// export default Contact;

import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
} from "@mui/material";
import {
  HealthAndSafety,
  Psychology,
  Group,
  EmojiEvents,
} from "@mui/icons-material";

const VeChungToi = () => {
  const teamMembers = [
    {
      name: "Dr. Nguyễn Văn A",
      role: "Chuyên gia Y khoa",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "ThS. Trần Thị B",
      role: "Tâm lý học",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      name: "Lê Văn C",
      role: "Cố vấn hỗ trợ",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ];

  const values = [
    {
      icon: <HealthAndSafety sx={{ fontSize: 40, color: "#2E7D32" }} />,
      title: "Sức khỏe là ưu tiên",
      description:
        "Chúng tôi đặt sức khỏe của bạn lên hàng đầu trong mọi quyết định",
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: "#2E7D32" }} />,
      title: "Hỗ trợ tâm lý",
      description: "Đồng hành cùng bạn vượt qua những thách thức tâm lý",
    },
    {
      icon: <Group sx={{ fontSize: 40, color: "#2E7D32" }} />,
      title: "Cộng đồng",
      description:
        "Xây dựng cộng đồng hỗ trợ lẫn nhau trong hành trình cai thuốc",
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: "#2E7D32" }} />,
      title: "Thành công bền vững",
      description: "Hướng tới kết quả lâu dài và thay đổi lối sống tích cực",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#E8F5E8", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: "#1B5E20",
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Về Chúng Tôi
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#2E7D32",
              mb: 4,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            QuitSmoke - Đồng hành cùng bạn trên hành trình cai thuốc lá
          </Typography>
        </Box>

        {/* Mission Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 6,
            backgroundColor: "#C8E6C9",
            borderLeft: "5px solid #4CAF50",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "#1B5E20", mb: 3, fontWeight: "bold" }}
          >
            Sứ Mệnh Của Chúng Tôi
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#2E7D32", fontSize: "1.1rem", lineHeight: 1.8 }}
          >
            QuitSmoke được thành lập với sứ mệnh giúp đỡ hàng triệu người Việt
            Nam thoát khỏi tệ nạn thuốc lá. Chúng tôi tin rằng mỗi người đều có
            khả năng thay đổi và xây dựng một cuộc sống khỏe mạnh hơn. Với đội
            ngũ chuyên gia y tế, tâm lý học và công nghệ, chúng tôi cung cấp các
            giải pháp toàn diện, khoa học và hiệu quả để hỗ trợ quá trình cai
            thuốc lá.
          </Typography>
        </Paper>

        {/* Values Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#1B5E20",
              textAlign: "center",
              mb: 4,
              fontWeight: "bold",
            }}
          >
            Giá Trị Cốt Lõi
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "#F1F8E9",
                    border: "2px solid #A5D6A7",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease-in-out",
                      boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Box sx={{ mb: 2 }}>{value.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#1B5E20", mb: 2, fontWeight: "bold" }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#2E7D32", lineHeight: 1.6 }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Team Section */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h4"
            sx={{
              color: "#1B5E20",
              textAlign: "center",
              mb: 4,
              fontWeight: "bold",
            }}
          >
            Đội Ngũ Chuyên Gia
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 3,
                    backgroundColor: "#F1F8E9",
                    border: "2px solid #A5D6A7",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease-in-out",
                    },
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      border: "3px solid #4CAF50",
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{ color: "#1B5E20", fontWeight: "bold" }}
                  >
                    {member.name}
                  </Typography>
                  <Chip
                    label={member.role}
                    sx={{
                      backgroundColor: "#4CAF50",
                      color: "white",
                      mt: 1,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Stats Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            backgroundColor: "#4CAF50",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
            Thành Tựu Của Chúng Tôi
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
                10,000+
              </Typography>
              <Typography variant="h6">
                Người đã cai thuốc thành công
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
                95%
              </Typography>
              <Typography variant="h6">
                Tỷ lệ hài lòng của khách hàng
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>
                5+
              </Typography>
              <Typography variant="h6">Năm kinh nghiệm</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default VeChungToi;
