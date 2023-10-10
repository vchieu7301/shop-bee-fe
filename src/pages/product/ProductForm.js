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

const ProductForm = ({ initialProduct, handleSubmit, handleClose }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(initialProduct || {});

  useEffect(() => {
    setProduct(initialProduct || {});
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const productData = {
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      // Add other product-related fields here based on your product data structure
    };
    handleSubmit(productData);
    handleClose();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="md"
      sx={{}}
    >
      <DialogTitle>{initialProduct ? "Edit Product" : "Add Product"}</DialogTitle>
      <DialogContent sx={{ overflow: "visible", height: "auto" }}>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="product_name"
                value={product.product_name || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                value={product.description || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Price"
                type="number"
                name="price"
                value={product.price || ""}
                onChange={handleChange}
              />
            </Grid>
            {/* Add other product-related fields here based on your product data structure */}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {initialProduct ? "Save" : "Add"}
              </Button>
            </DialogActions>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
