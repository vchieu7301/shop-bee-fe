import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  Grid,
} from "@mui/material";
import { Snackbar } from "@mui/material";
import axios from "axios";
import Layout from "../../layouts/Layout";

const ChangePassword = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/admin/change-password`,
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );

      console.log("Password change successful:", response.data);
      if (response.data.error === true) {
        setAlertSeverity("error");
        setAlertMessage(response.data.message);
      } else {
        setAlertSeverity("success");
        setAlertMessage("Password change successful.");
      }
    } catch (error) {
      console.error("Error changing password:", error.response);
      setAlertSeverity("error");
      setAlertMessage("Error changing password.");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Paper elevation={2} sx={{ padding: 5 }}>
          <Typography variant="h4" gutterBottom>
            Change Password
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert severity={alertSeverity} onClose={handleSnackbarClose}>
                {alertMessage}
              </Alert>
            </Snackbar>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="Old Password"
                    fullWidth
                    required
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="New Password"
                    fullWidth
                    required
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="password"
                    label="Confirm New Password"
                    fullWidth
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} >
                  <Button type="submit" variant="contained" color="primary">
                    Change Password
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default ChangePassword;
