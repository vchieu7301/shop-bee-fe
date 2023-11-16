import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    status: "processing",
    shipping_address: "",
    coupon_code: "",
    shipping_fee: "",
    payment_method: "",
    subtotal: "",
  });
  const [total, setTotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const { cartItems, removeItemFromCart } = useContext(CartContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
        ...formData, 
        shipping_fee: shippingFee, 
        order_items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity_selected,
        })),
      };
    try {
      const response = await axios.post(
        `${apiUrl}/orders/palce-order`,
        orderData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log("Comfirm Order successfully:", response.data.message);
      cartItems.forEach((item) => {
        removeItemFromCart(item.id);
      });
      navigate("/")
    } catch (error) {
      console.error("Error comfirm Order:", error);
    }
  };

  useEffect(() => {
    const calculateTotal = () => {
      let totalPrice = 0;
      cartItems.forEach((item) => {
        totalPrice += item.price * item.quantity_selected;
      });
      setTotal(totalPrice);
    };
    calculateTotal();
    const calculatedShippingFee = total * 0.02;
    setShippingFee(calculatedShippingFee);
  }, [cartItems, total]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Shop-bee
      </Typography>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Address"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="payment-method-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment-method-label"
                  value={formData.payment_method || "none"}
                  label="Payment Method"
                  name="payment_method"
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="none">
                    <em>-None-</em>
                  </MenuItem>
                  <MenuItem value={"visa"}>Visa</MenuItem>
                  <MenuItem value={"mastercard"}>Mastercard</MenuItem>
                  <MenuItem value={"credit-card"}>Credit Card</MenuItem>
                  <MenuItem value={"paypal"}>PayPal</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Grid container justifyContent="center">
                  <Button variant="outlined" onClick={() => navigate("/cart")}>
                    Your Cart
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} md={8}>
                <Grid container justifyContent="center">
                  <Button variant="contained" type="submit">
                    Confirm Order
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: "#fafafa", p: 2 }}>
              {cartItems.map((item) => (
                <ListItem key={item.id} alignItems="flex-start">
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
                  <ListItemText
                    primary={
                        <Typography variant="subtitle1" gutterBottom fontWeight={"bold"}>
                        {item.product_name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="subtitle2" gutterBottom>
                        {item.quantity_selected} - ${item.price}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </Box>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                fullWidth
                label="Coupon Code"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    Shipping fee:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    ${shippingFee}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                  <Typography variant="subtitle1" noWrap gutterBottom>
                    Total amount:
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={4}
                  gutterBottom
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="h6" fontWeight={"bold"}>
                    ${total}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
