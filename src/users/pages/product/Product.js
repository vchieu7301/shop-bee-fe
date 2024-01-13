import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/Loader";
import { useCart } from "../../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/display-product/${id}`
        );
        if (response.data && response.data.result) {
          setProducts(response.data.result);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const productsToAdd = {
        ...products,
        quantity_selected: quantity,
      };
        try {
          addToCart(productsToAdd);
          console.log(`Added ${products.product_name} to cart successfully`);
        } catch (error) {
          console.error(`Failed to add ${products.product_name} to cart:`, error);
        }
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <Layout>
      {loading ? (
        <Loader />
      ) : (
        <Container maxWidth="md" sx={{ my: 10 }}>
            <Grid container spacing={2} key={products.id}>
              <Grid item xs={12} md={6}>
                <Card>
                  <Box
                    component="img"
                    height="auto"
                    width="100%"
                    src={apiUrl + "/images/" + products.images}
                    alt={products.product_name}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      {products.product_name}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Price: ${products.price}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
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
                            inputProps: { min: 1, max: products.quantity },
                          }}
                        />
                        <IconButton size="small" onClick={handleIncrease}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      endIcon={<ShoppingCartIcon />}
                      onClick={handleAddToCart}
                      sx={{
                        my: 2,
                        bgcolor: "#eceff1",
                        color: "black",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "black",
                        },
                      }}
                    >
                      Thêm Vào Giỏ
                    </Button>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body1" gutterBottom>
                      {products.product_description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
        </Container>
      )}
    </Layout>
  );
}
