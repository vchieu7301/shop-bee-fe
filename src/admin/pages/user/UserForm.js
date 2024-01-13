import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";

const UserForm = ({ initialUser, handleSubmit, handleClose }) => {
  const [user, setUser] = useState(
    initialUser || { name: "", email: "" }
  );

  useEffect(() => {
    setUser(initialUser || { name: "", email: ""});
  }, [initialUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(user);
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>{initialUser ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <DialogActions sx={{ justifyContent: "flex-end" }}>
                <Button onClick={handleClose} color="primary" size="large">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                >
                  {initialUser ? "Save" : "Add"}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
