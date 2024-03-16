import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import apiService from '../../services/apiService';

const OrderForm = ({ initialOrder, handleSubmit, handleClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [productList, setProductList] = useState([]);
  const [order, setOrder] = useState(initialOrder || {});

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const response = await apiService.getProducts();
        if (response && response.result) {
          setProductList(response && response.result);
        }
      } catch (error) {
        console.error("Error fetching product list:", error);
      }
    };
    setOrder(initialOrder || {});
    fetchProductList();
  }, [initialOrder, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      order_date: order.order_date,
      shipping_address: order.shipping_address,
      payment_method: order.payment_method,
      subtotal: order.subtotal,
      status: order.status,
      coupon_code: order.coupon_code,
      shipping_fee: order.shipping_fee,
      order_items: [
        {
          product_id: order.product_id,
          quantity: order.quantity,
        },
      ],
    };
    handleSubmit(orderData);
    handleClose();
  };

  const formatDateForTextField = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth={true}
      >
      <DialogTitle>{initialOrder ? "Edit Order" : "Add Order"}</DialogTitle>
      <DialogContent sx={{ overflow: "visible", height: "auto" }}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Order Date"
                type="date"
                name="order_date"
                value={formatDateForTextField(order.order_date) || ''}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Shipping Address"
                name="shipping_address"
                value={order.shipping_address || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="payment-method-select-label">
                  Payment Method*
                </InputLabel>
                <Select
                  id="payment-method"
                  name="payment_method"
                  value={order.payment_method || "0"}
                  label="Payment Method"
                  labelId="payment-method-select-label"
                  onChange={handleChange}
                >
                  <MenuItem value="0">
                    <em>-None-</em>
                  </MenuItem>
                  <MenuItem value="Cash">
                    Cash
                  </MenuItem>
                  <MenuItem value="Visa">Visa</MenuItem>
                  <MenuItem value="Paypal">Paypal</MenuItem>
                  <MenuItem value="Mastercard">Mastercard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="product-select-label">
                  Select a Product*
                </InputLabel>
                <Select
                  id="product-select"
                  name="product_id"
                  value={order.product_id || "0"}
                  label="Select a Product"
                  labelId="product-select-label"
                  onChange={handleChange}
                >
                  <MenuItem value="0">
                    <em>-None-</em>
                  </MenuItem>
                  {productList.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.product_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Status*</InputLabel>
                <Select
                  id="status"
                  name="status"
                  value={order.status || "0"}
                  label="Status"
                  labelId="status-select-label"
                  onChange={handleChange}
                >
                  <MenuItem value="0">
                    <em>-None-</em>
                  </MenuItem>
                  <MenuItem value="Processing">Processing</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Quantity"
                type="number"
                name="quantity"
                value={order.quantity || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Coupon Code"
                name="coupon_code"
                value={order.coupon_code || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shipping fee"
                name="shipping_fee"
                value={order.shipping_fee || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DialogActions>
                <Button onClick={handleClose} color="primary" size="large">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="large"
                >
                  {initialOrder ? "Save" : "Add"}
                </Button>
              </DialogActions>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
