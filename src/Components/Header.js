import React, { useState, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemIcon,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  ManageAccounts as ManageAccountsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LayoutContext from "../context/LayoutContext";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const { selectedListItem } = useContext(LayoutContext);


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
    axios
      .post(`${apiUrl}/admin/sign-out`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userID");
        console.log("Logout successful");
        navigate("/admin/login");
        handleClose();
      })
      .catch((error) => {
        console.error("Logout failed", error);
        handleClose();
      });
  };

  const menuItems = [
    {
      text: "Change Password",
      icon: <ManageAccountsIcon />,
      path: "/admin/change-password",
    },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ bgcolor:'#fff', color: 'black' }}>
          <Box>
            <Typography variant="h6">{selectedListItem}</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <ThemeSwitcher />
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
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
              {menuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={
                    item.onClick ? item.onClick : () => navigate(item.path)
                  }
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {item.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
