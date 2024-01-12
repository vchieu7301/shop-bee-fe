import React, { useEffect, useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
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
import apiService from '../../services/apiService';

export default function Orders() {
  const [listData, setListData] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getOrders();
        if (response && response.result) {
          setListData(
            response.result.map((row, index) => {
              const productDetails = row.details && row.details.length > 0 ? row.details[0] : null;
              return {
                id: row.order.id,
                index: index + 1,
                order_date: row.order.order_date,
                user: row.user,
                shipping_address: row.order.shipping_address,
                coupon_code: row.order.coupon_code,
                shipping_fee: row.order.shipping_fee,
                status: row.order.status,
                payment_method: row.order.payment_method,
                product_id: productDetails ? productDetails.product_id : null,
                product_name: productDetails ? (productDetails.product_name ? productDetails.product_name.product_name : null) : null,
                quantity: productDetails ? productDetails.quantity : null,
                subtotal: row.details ? row.details.reduce((sum, detail) => sum + (detail.subtotal || 0), 0) : 0,
              };
            })
          );
        }
        console.log(listData)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);

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
    try {
      if (editingOrder) {
        console.log("Editing order:", formData);
        await apiService.editOrder(editingOrder.id, formData);
      } else {
        console.log("Adding order:", formData);
        await apiService.addOrder(formData);
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
      await apiService.deleteOrder(deleteOrderId);
      console.log("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const tableHeadData = [
    "Order ID",
    "Product Name",
    "Status",
    "Payment Method",
    "Sale Amount",
    "Actions",
  ];
  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        <Paper elevation={2} sx={{ padding: 5 }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h3">Orders</Typography>
            </Grid>
            <Grid item>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                New Order
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
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.product_name}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>{order.payment_method}</TableCell>
                          <TableCell>{order.subtotal}</TableCell>
                          <TableCell>
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => handleEdit(order.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              color="secondary"
                              onClick={() => handleDelete(order.id)}
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
            Are you sure you want to delete this order?
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
