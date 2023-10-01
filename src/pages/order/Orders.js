import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../../layouts/Layout";
import { Box, Container, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function Orders() {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [listData, setListData] = useState([]);
  const preventDefault = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/admin/orders`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("PersonalAccessToken"),
          },
        });
        setListData(
          response.data.result.map((row, index) => ({
            id:row.order.id,
            index: index + 1,
            order_date: row.order.order_date,
            user: row.user,
            shipping_address: row.order.shipping_address,
            payment_method: row.order.payment_method,
            subtotal: row.details.reduce((sum, detail) => sum + detail.subtotal, 0),
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, apiUrl]);

  const columns = [
    { field: "index", headerName: "#", width: 100 },
    { field: "order_date", headerName: "Date", width: 150 },
    { field: "user", headerName: "Name", width: 150 },
    { field: "shipping_address", headerName: "Ship To", width: 200 },
    { field: "payment_method", headerName: "Payment Method", width: 150 },
    { field: "subtotal", headerName: "Sale Amount", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      headerAlign: 'center',
      align: 'center',
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

  const handleEdit = (id) => {
    // Handle edit action here
    console.log("Edit clicked for ID:", id);
  };

  const handleDelete = (id) => {
    // Handle delete action here
    console.log("Delete clicked for ID:", id);
  };
  const handleAdd = () => {
    // Handle the "Add Order" button click
    // Implement the logic to show the add order form or perform any other action
    console.log('Add Order button clicked');
  };

  return (
    <Layout>
   <Container sx={{ mt:10 }}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={listData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableColumnMenu
            rowHeight={70}
            columnHeaderHeight={80}
          />
        </Box>
      </Container>
    </Layout>
  );
}
