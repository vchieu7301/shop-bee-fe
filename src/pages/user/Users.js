import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import UserForm from "./UserForm";
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
import apiService from "../../services/apiService";

export default function Users() {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getUsers();
        if (response && response.result) {
          setListData(
            response.result.map((row, index) => ({
              id: row.id,
              index: index + 1,
              name: row.name,
              email: row.email,
              role: row.role_name,
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
  }, [navigate]);

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
    setEditingUser(null);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingUser(null);
  };

  const handleEdit = (id) => {
    const userToEdit = listData.find((user) => user.id === id);
    if (userToEdit) {
      setIsFormVisible(true);
      setEditingUser(userToEdit);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        console.log("Editing user:", formData);
        await apiService.editUser(editingUser.id, formData);
      } else {
        console.log("Adding user:", formData);
        await apiService.addUser(formData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiService.deleteUser(deleteUserId);
      console.log("User deleted successfully:");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const tableHeadData = ["User ID", "Name", "Email", "Actions"];

  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Paper elevation={2} sx={{ padding: 5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h3">Users</Typography>
            </Grid>
            <Grid item>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                New User
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
              <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
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
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>#{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={() => handleEdit(user.id)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="secondary"
                                onClick={() => handleDelete(user.id)}
                              >
                                <DeleteOutlineIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
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
              {editingUser ? (
                <Box>
                  <UserForm
                    initialUser={editingUser}
                    handleSubmit={handleFormSubmit}
                    handleClose={handleFormClose}
                  />
                </Box>
              ) : (
                <Box>
                  <UserForm
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
            Are you sure you want to delete this user?
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
