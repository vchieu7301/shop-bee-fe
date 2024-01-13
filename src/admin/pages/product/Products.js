import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../layouts/Layout";
import ProductForm from "./ProductForm"; // Assuming you have a ProductForm component
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import Loader from "../../../components/Loader";
import ImageRenderer from "./ImageRenderer";
import apiService from '../../services/apiService';

export default function Products() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [listData, setListData] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getProducts();
        if (response && response.result) {
          setListData(
            response.result.map((row, index) => ({
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
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, apiUrl]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilter = () => {};

  const handleAdd = () => {
    setIsFormVisible(true);
    setEditingProduct(null);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingProduct(null);
  };

  const handleEdit = (id) => {
    const productToEdit = listData.find((product) => product.id === id);
    if (productToEdit) {
      setIsFormVisible(true);
      setEditingProduct(productToEdit);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        console.log("Editing product:", formData);
        await apiService.editProduct(editingProduct.id, formData);
      } else {
        console.log("Adding product:", formData);
        await apiService.addProduct(formData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteProductId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.deleteProduct(deleteProductId);
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/admin/categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      console.log("Category added successfully:", response.data);
      setIsFormVisible(true);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const tableHeadData = [
    "Product ID",
    "Product Name",
    "Price",
    "Quantity",
    "Description",
    "Category",
    "Image",
    "Actions",
  ];

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Paper elevation={2} sx={{ padding: 5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h3">Product</Typography>
            </Grid>
            <Grid item>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                New Product
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid
            container
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item></Grid>
            <Grid item>
              <IconButton
                onClick={handleFilter}
                color="inherit"
                aria-label="Filter list"
              >
                <FilterListIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Box sx={{ height: 600, width: "100%" }}>
            {loading && !isFormVisible ? (
              <Loader />
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {tableHeadData.map((header, index) => (
                        <TableCell key={index}>{header}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>#{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.price}$</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>{product.category_name}</TableCell>
                          <TableCell sx={{ maxWidth: "100px", maxHeight: "100px" }}>
                            <ImageRenderer value={product.image} />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => handleEdit(product.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="secondary"
                              onClick={() => handleDelete(product.id)}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              count={listData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          {isFormVisible && (
            <Box>
              {editingProduct ? (
                <Box>
                  <ProductForm
                    initialProduct={editingProduct}
                    handleSubmit={handleFormSubmit}
                    handleAddCategory={handleAddCategory}
                    handleClose={handleFormClose}
                  />
                </Box>
              ) : (
                <Box>
                  <ProductForm
                    handleSubmit={handleFormSubmit}
                    handleAddCategory={handleAddCategory}
                    handleClose={handleFormClose}
                  />
                </Box>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this product?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" size="large">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="primary"
            size="large"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
