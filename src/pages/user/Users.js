import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Components/Loader";

export default function Users() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [listData, setListData] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/admin/users`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        });
        if (response.data && response.data.result) {
          setListData(
            response.data.result.map((row, index) => ({
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
  }, [navigate, apiUrl]);

  const columns = [
    { field: "index", headerName: "#", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "role", headerName: "Role", flex: 1 },
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
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "application/json",
    };

    try {
      if (editingUser) {
        console.log("Editing user:", formData);
        await axios.put(`${apiUrl}/admin/users/${editingUser.id}`, formData, {
          headers,
        });
      } else {
        console.log("Adding user:", formData);
        await axios.post(`${apiUrl}/admin/users`, formData, {
          headers,
        });
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
      const response = await axios.delete(
        `${apiUrl}/admin/users/${deleteUserId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        }
      );
      console.log("User deleted successfully:", response.data.message);
    } catch (error) {
      console.error("Error deleting user:", error);
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
