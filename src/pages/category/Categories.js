import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
import CategoryForm from "./CategoryForm";
import Layout from "../../layouts/Layout";
import axios from "axios";

export default function Categories() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/admin/categories`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        });
        if (response.data && response.data.result) {
          setCategories(
            response.data.result.map((category, index) => ({
              id: category.id,
              index: index + 1,
              category_name: category.category_name,
              description: category.description,
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
  }, [apiUrl]);

  const columns = [
    { field: "index", headerName: "#", flex: 0.5 },
    { field: "category_name", headerName: "Category Name", flex: 1 },
    { field: "description", headerName: "Description", flex: 1.5 },
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
    setEditingCategory(null);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingCategory(null);
  };

  const handleEdit = (id) => {
    const categoryToEdit = categories.find((category) => category.id === id);
    if (categoryToEdit) {
      setIsFormVisible(true);
      setEditingCategory(categoryToEdit);
    }
  };

  const handleFormSubmit = async (formData) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "application/json",
    };

    try {
      if (editingCategory) {
        console.log("Editing order:", formData);
        await axios.put(`${apiUrl}/admin/categories/${editingCategory.id}`,formData,{
            headers,
          });
      } else {
        console.log("Adding order:", formData);
        await axios.post(`${apiUrl}/admin/categories`, formData, {
          headers,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteCategoryId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/admin/categories/${deleteCategoryId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        }
      );
      console.log("Category deleted successfully:", response.data.message);
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Box sx={{ height: 400, width: "100%" }}>
          {loading && !isFormVisible ? (
            <Loader />
          ) : (
            <DataGrid
              rows={categories}
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
            {editingCategory ? (
              <Box>
                <CategoryForm
                  initialCategory={editingCategory}
                  handleSubmit={handleFormSubmit}
                  handleClose={handleFormClose}
                />
              </Box>
            ) : (
              <Box>
                <CategoryForm
                  handleSubmit={handleFormSubmit}
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
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary" size="large">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" size="large" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
