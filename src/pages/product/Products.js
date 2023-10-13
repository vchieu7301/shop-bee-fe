import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
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
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Components/Loader";
import ImageRenderer from "./ImageRenderer";

export default function Products() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [listData, setListData] = useState([]);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/admin/products`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        });
        if (response.data && response.data.result) {
          setListData(
            response.data.result.map((row, index) => ({
              id: row.id,
              index: index + 1,
              name: row.product_name,
              quantity: row.quantity,
              category: row.category_name,
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

  const columns = [
    { field: "index", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "price", headerName: "Price", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => <ImageRenderer value={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <IconButton
          aria-label="add"
          color="primary"
          onClick={() => handleAdd()}
        >
          <AddIcon />
        </IconButton>
      ),
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between">
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            color="secondary"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

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
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "application/json",
    };

    try {
      if (editingProduct) {
        console.log("Editing product:", formData);
        await axios.put(
          `${apiUrl}/admin/products/${editingProduct.id}`,
          formData,
          {
            headers,
          }
        );
      } else {
        console.log("Adding product:", formData);
        await axios.post(`${apiUrl}/admin/products`, formData, {
          headers,
        });
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
      const response = await axios.delete(
        `${apiUrl}/admin/products/${deleteProductId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        }
      );
      console.log("Product deleted successfully:", response.data.message);
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

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Box sx={{ height: 400, width: "100%" }}>
          {loading && !isFormVisible ? (
            <Loader />
          ) : (
            <DataGrid
              rows={listData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableColumnMenu
              rowHeight={70}
              columnHeaderHeight={80}
            />
          )}
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
