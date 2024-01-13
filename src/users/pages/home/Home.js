import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import Loader from "../../../components/Loader";
import Layout from "../../layouts/Layout";

import Slider from "./Slider";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/dashboard`
        );
        if (response.data && response.data.result) {
          setProducts(
            response.data.result.map((row, index) => ({
              id: row.id,
              index: index + 1,
              name: row.product_name,
              quantity: row.quantity,
              category_id: row.category_id,
              category_name: row.category_name,
              description: row.product_description,
              price: row.price,
              image: row.images,
            }))
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const redirectToCart = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Layout>
      <Box>
        <Box sx={{ position: "relative" }}>
          <Banner />
          {/* <Slider sx={{ position: "relative", zIndex: 1 }} /> */}
        </Box>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#004d40"
          }}
        >
          SẢN PHẨM MỚI
        </Typography>
        {loading ? (
          <Loader />
        ) : (
          <Container sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={4} md={4} lg={3} key={product.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ position: "relative", height: "400px" }}>
                        <img
                          src={apiUrl + "/images/" + product.image}
                          alt={product.product_name}
                          style={{
                            width: "100%",
                            height: "auto",
                            transition: "transform 0.2s ease-in-out",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "0",
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                          }}
                        >
                          <Box sx={{ padding: "10px", position: "relative" }}>
                            <Typography variant="subtitle1" color="black">
                              {product.name}
                            </Typography>
                            <Typography variant="subtitle2" color="black">
                              {product.price} $
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={() => redirectToCart(product.id)}
                              sx={{
                                backgroundColor: "#ffffff",
                                color: "black",
                                border: "1px solid #ffffff",
                                fontSize: 8,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                "&:hover": {
                                  backgroundColor: "rgba( 0, 0, 0, 0.5)",
                                  color: "#ffffff",
                                },
                              }}
                              endIcon={<ShoppingCartIcon />}
                            >
                              Mua ngay
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => redirectToCart(product.id)}
                              sx={{
                                backgroundColor: "#ffffff",
                                color: "black",
                                border: "1px solid #ffffff",
                                fontSize: 8,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                "&:hover": {
                                  backgroundColor: "rgba( 0, 0, 0, 0.5)",
                                  color: "#ffffff",
                                },
                              }}
                              endIcon={<VisibilityIcon />}
                            >
                              Chi tiết
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Box>
    </Layout>
  );
}

export default Home;
