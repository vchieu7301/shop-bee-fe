import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const UserForm = ({ initialUser, handleSubmit, handleClose }) => {
  const [user, setUser] = useState(
    initialUser || { name: "", email: "", role: "" }
  );
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    setUser(initialUser || { name: "", email: "", role: "" });
    axios
      .get(`${apiUrl}/admin/users`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Token"),
        },
      })
      .then((response) => {
        setRoles(response.data.roles);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
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
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Role*</InputLabel>
                <Select
                  id="role"
                  name="role"
                  value={user.role || ""}
                  label="Role"
                  labelId="role-select-label"
                  onChange={handleInputChange}
                >
                  <MenuItem value="0">
                    <em>-None-</em>
                  </MenuItem>
                  {roles.map((role) => (
                    <MenuItem key={role.role_id} value={role.role_idid}>
                      {role.role_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
