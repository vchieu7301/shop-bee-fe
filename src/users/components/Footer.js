import React from "react";
import {
  Typography,
  Link,
  Grid,
  Box,
  Container,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

function Footer() {
  return (
    <Box component="div" sx={{ bgcolor: "#fafafa", py: 4 }}>
      <Container maxWidth="lg" sx={{ pt: "10px" }}>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Giới thiệu
            </Typography>
            <Box component="div">
              <Typography variant="body2">
                <Link href="#">Liên kết</Link>
              </Typography>
              <Typography variant="body2">
                <Link href="#">Tìm kiếm</Link>
              </Typography>
              <Typography variant="body2">
                <Link href="#">Chính sách đổi trả</Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              CHÍNH SÁCH BẢO MẬT
            </Typography>
            <Box component="div">
              <Typography variant="body2">
                <Link href="#">Chính sách bảo mật</Link>
              </Typography>
              <Typography variant="body2">
                <Link href="#">Điều khoản dịch vụ</Link>
              </Typography>
              <Typography variant="body2">
                <Link href="#">Liên hệ</Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              THÔNG TIN THANH TOÁN
            </Typography>
            <Box component="div">
              <Typography variant="body2">Thông tin liên hệ</Typography>
              <Typography variant="body2">HỘ KINH DOANH</Typography>
              <Typography variant="body2">
                <Link href="#">Facebook</Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              NEWSLETTER
            </Typography>
            <Typography variant="body2" gutterBottom>
              Hãy để lại email của bạn để nhận được những ý tưởng trang trí mới
              và những thông tin, ưu đãi từ Shop-bee
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <TextField
                  label="Đăng ký email"
                  variant="outlined"
                  size="small"
                  placeholder="Nhập email của bạn"
                />
              </Grid>
              <Grid item>
                <Button variant="contained" size="small" color="primary">
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" align="center">
          &copy; {new Date().getFullYear()} . All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
