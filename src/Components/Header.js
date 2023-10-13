import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Menu, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LayoutContext from "../context/LayoutContext";

export default function Header() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { selectedListItem } = React.useContext(LayoutContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.error("No token found");
      handleClose();
      return;
    }
    axios.post(`${apiUrl}/admin/sign-out`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem("Token");
        localStorage.removeItem("UserName");
        localStorage.removeItem("UserId");
        console.log("Logout successful");
        navigate("/admin/login");
        handleClose();
      })
      .catch((error) => {
        console.error("Logout failed", error);
        handleClose();
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Box>
        <Typography variant="h6">{selectedListItem}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              id="menu-appbar"
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
