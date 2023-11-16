import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  TextField,
  ListItemText,
  Button,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Clear as ClearIcon,
  ProductionQuantityLimits as ProductionQuantityLimitsIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CartContext from "../context/CartContext";

export default function Header() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeItemFromCart } = useContext(CartContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login`, {
        email: email,
        password: password,
      });
      navigate("/");
      JSON.stringify(
        localStorage.setItem("token", response.data.token),
        localStorage.setItem("userID", response.data.user.id),
        localStorage.setItem("userName", response.data.user.name)
      );
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  const handleLogout = () => {
    const token = localStorage.getItem("token");
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
        navigate("/");
        handleClose();
      })
      .catch((error) => {
        console.error("Logout failed", error);
        handleClose();
      });
  };

  const handleCartClick = () => {
    setShowCart(!showCart);
  };
  
  const userMenuItems = [
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  const renderMenuItems = () => {
    if (localStorage.getItem("token")) {
      return (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "300px",
            },
          }}
        >
          {userMenuItems.map((item, index) => (
            <MenuItem key={index} onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </MenuItem>
          ))}
        </Menu>
      );
    } else {
      return (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: "300px",
            },
          }}
        >
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              LOG IN TO ACCOUNT
            </Typography>
          </MenuItem>
          <MenuItem>
            <TextField
              required
              id="email"
              label="Email"
              variant="outlined"
              fullWidth
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </MenuItem>
          <MenuItem>
            <TextField
              required
              id="password"
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </MenuItem>
          <MenuItem>
            <Typography component={"span"} variant="caption" gutterBottom>
              This site is protected by reCAPTCHA <br />
              and the Google <Link href="#">Privacy Policy</Link> and
              <br />
              <Link href="#">Terms of Service</Link> apply.
            </Typography>
          </MenuItem>
          <MenuItem>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                bgcolor: "#eceff1",
                color: "black",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              Login
            </Button>
          </MenuItem>
          <MenuItem>
            <Typography variant="body2" gutterBottom>
              Don't have an account?
              <Link href="/sign-up">{" Sign Up"}</Link>
            </Typography>
          </MenuItem>
        </Menu>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          backgroundColor: "teal",
          color: "white",
          padding: "3px",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Super deal! Free Shipping on Orders Overs $50
      </Box>
      <AppBar position="static" sx={{ bgcolor: "#fafafa", color: "#212121" }}>
        <Toolbar>
          <Box sx={{ marginRight: "20px" }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              SHOP-BEE.
            </Typography>
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
              sx={{ padding: 1, marginX: 1 }}
            >
              <AccountCircleIcon />
            </IconButton>
            {renderMenuItems()}
            <IconButton
              size="large"
              edge="end"
              aria-label="shopping cart"
              aria-haspopup="true"
              onClick={handleCartClick}
              color="inherit"
              sx={{ padding: 1, marginX: 1 }}
            >
              <ShoppingCartIcon />
            </IconButton>
            {showCart && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  zIndex: "999",
                  padding: "8px",
                  minWidth: "300px",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      Cart
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  {cartItems.length === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        height: "100px",
                        marginLeft: "10px",
                      }}
                    >
                      <ProductionQuantityLimitsIcon
                        sx={{ fontSize: 60, color: "gray" }}
                      />
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ textAlign: "center" }}
                      >
                        There are currently no products
                      </Typography>
                    </Box>
                  ) : (
                    <Grid container spacing={1}>
                      {cartItems?.map((item) => {
                        let total = item.price * item.quantity_selected;
                        return (
                          <Grid item key={item.id} xs={12}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginLeft: "20px",
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <img
                                  src={apiUrl + "/images/" + item.images}
                                  alt={item.product_name}
                                  style={{
                                    width: "60px",
                                    height: "60px",
                                    marginRight: "20px",
                                  }}
                                />
                                <Typography variant="h6" gutterBottom>
                                  {item.product_name}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "20px",
                                }}
                              >
                                <Typography variant="subtitle2" gutterBottom>
                                  {item.quantity_selected}
                                </Typography>
                                <Typography variant="subtitle2" gutterBottom>
                                  $ {item.price}
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <IconButton
                                  onClick={() => removeItemFromCart(item.id)}
                                >
                                  <ClearIcon />
                                </IconButton>
                              </Box>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={1}>
                              <Grid item xs={6}>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  sx={{ ml: 2 }}
                                >
                                  Total amount:
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  color="red"
                                >
                                  $ {total}
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container spacing={1} sx={{ mt: 1 }}>
                              <Grid
                                item
                                xs={6}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  onClick={()=>navigate("/cart")}
                                  sx={{
                                    mb: 2,
                                    bgcolor: "#eceff1",
                                    color: "black",
                                    "&:hover": {
                                      backgroundColor: "white",
                                      color: "black",
                                    },
                                  }}
                                >
                                  Your Cart
                                </Button>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  onClick={() => navigate("/checkouts")}
                                  sx={{
                                    mb: 2,
                                    bgcolor: "#eceff1",
                                    color: "black",
                                    "&:hover": {
                                      backgroundColor: "white",
                                      color: "black",
                                    },
                                  }}
                                >
                                  Checkout
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
