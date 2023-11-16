import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  IconButton,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import Layout from "../../layouts/Layout";
import CartContext from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { cartItems, removeItemFromCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity_selected;
      });
      setTotal(totalPrice);
    };
    calculateTotal();
  }, [cartItems, total]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={"bold"}
          sx={{ display: "flex", justifyContent: "center", my: 2 }}
        >
          Your Cart
        </Typography>
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center", my: 2 }}
        >
          There is {cartItems.length} product in the cart
        </Typography>
        <Divider sx={{ my: 2 }} />
        <List>
          {cartItems.map((item) => (
            <ListItem key={item.id}>
              <Box sx={{ width: 60, height: 60, marginRight: 5 }}>
                <img
                  src={apiUrl + "/images/" + item.images}
                  alt={item.product_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1" gutterBottom fontWeight={"bold"}>
                  {item.product_name}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "fit-content",
                    padding: "2px",
                  }}
                >
                  <IconButton size="small" onClick={handleDecrease}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    type="number"
                    value={quantity}
                    sx={{
                      textAlign: "center",
                      width: "50px",
                      fontSize: "12px",
                    }}
                    InputProps={{
                      inputProps: { min: 1, max: item.quantity },
                    }}
                  />
                  <IconButton size="small" onClick={handleIncrease}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  <ClearIcon />
                </IconButton>
                <Typography variant="subtitle1" gutterBottom fontWeight={"bold"}>
                  ${item.price * item.quantity_selected}
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Total: ${total}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            mt: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/checkouts")}
            sx={{ marginBottom: 2 }}
          >
            Process To Checkout
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default Cart;
