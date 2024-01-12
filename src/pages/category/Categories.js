import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
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
import Loader from "../../Components/Loader";
import CategoryForm from "./CategoryForm";
import Layout from "../../layouts/Layout";
import apiService from '../../services/apiService';

export default function Categories() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [categories, setCategories] = useState([]);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCategories();
        if (response && response.result) {
          setCategories(
            response.result.map((category, index) => ({
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

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleFilter = () => {};

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
    try {
      if (editingCategory) {
        console.log("Editing category:", formData);
        await apiService.editCategory(editingCategory.id, formData);
      } else {
        console.log("Adding category:", formData);
        await apiService.addCategory(formData);
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
      await apiService.deleteCategory(deleteCategoryId);
      console.log("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const tableHeadData = [
    "Category ID",
    "Category Name",
    "Description",
    "Actions",
  ];

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Paper elevation={2} sx={{ padding: 5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h3">Categories</Typography>
            </Grid>
            <Grid item>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                New Category
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
                    {categories
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>#{category.id}</TableCell>
                          <TableCell>{category.category_name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => handleEdit(category.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="secondary"
                              onClick={() => handleDelete(category.id)}
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
              count={categories.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
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
            Are you sure you want to delete this category?
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
