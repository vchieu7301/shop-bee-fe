import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../layouts/Layout";
import OrderForm from "./OrderForm";
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
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Components/Loader";

export default function Orders() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [listData, setListData] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/admin/orders`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("Token"),
          },
        });
        if (response.data && response.data.result) {
          setListData(
            response.data.result.map((row, index) => ({
              id: row.order.id,
              index: index + 1,
              order_date: row.order.order_date,
              user: row.user,
              shipping_address: row.order.shipping_address,
              coupon_code: row.order.coupon_code,
              shipping_fee: row.order.shipping_fee,
              status: row.order.status,
              payment_method: row.order.payment_method,
              product_id: row.details[0].product_id,
              quantity: row.details[0].quantity,
              subtotal: row.details.reduce(
                (sum, detail) => sum + detail.subtotal,
                0
              ),
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
    { field: "order_date", headerName: "Date", flex: 1 },
    { field: "user", headerName: "Name", flex: 1 },
    { field: "shipping_address", headerName: "Ship To", flex: 1.5 },
    { field: "payment_method", headerName: "Payment Method", flex: 1 },
    { field: "subtotal", headerName: "Sale Amount", flex: 1 },
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
    setEditingOrder(null);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setEditingOrder(null);
  };

  const handleEdit = (id) => {
    const orderToEdit = listData.find((order) => order.id === id);
    if (orderToEdit) {
      setIsFormVisible(true);
      setEditingOrder(orderToEdit);
    }
  };

  const handleFormSubmit = async (formData) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("Token")}`,
      "Content-Type": "application/json",
    };

    try {
      if (editingOrder) {
        console.log("Editing order:", formData);
        await axios.put(`${apiUrl}/admin/orders/${editingOrder.id}`, formData, {
          headers,
        });
      } else {
        console.log("Adding order:", formData);
        await axios.post(`${apiUrl}/admin/orders`, formData, {
          headers,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = (id) => {
    setDeleteOrderId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `${apiUrl}/admin/orders/${deleteOrderId}`,
        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("PersonalAccessToken"),
          },
        }
      );
      console.log("Order deleted successfully:", response.data.message);
    } catch (error) {
      console.error("Error deleting order:", error);
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
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            {loading && !isFormVisible ? <Loader /> : (
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
              {editingOrder ? (
                <Box>
                  <OrderForm
                    initialOrder={editingOrder}
                    handleSubmit={handleFormSubmit}
                    handleClose={handleFormClose}
                  />
                </Box>
              ) : (
                <Box>
                  <OrderForm
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
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
