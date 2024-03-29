import React, { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Loader from "../../../components/Loader";
import apiService from '../../services/apiService';

function Dashboard() {
  const [listData, setListData] = useState([]);
  const [totalUsers, setTotalUsers] = useState("00");
  const [totalAmount, setTotalAmount] = useState("00");
  const [loading, setLoading] = useState(true);

  const monthChartData = [
    { name: "January", sales: 65 },
    { name: "February", sales: 59 },
    { name: "March", sales: 80 },
    { name: "April", sales: 81 },
    { name: "May", sales: 56 },
    { name: "June", sales: 50 },
    { name: "July", sales: 47 },
    { name: "August", sales: 55 },
    { name: "September", sales: 58 },
    { name: "October", sales: 60 },
    { name: "November", sales: 52 },
    { name: "December", sales: 50 },
  ];

  const monthSales = monthChartData.reduce(
    (total, dataPoint) => total + dataPoint.sales,
    0
  );

  const weekChartData = [
    { name: "Mo", sales: 65 },
    { name: "Tu", sales: 59 },
    { name: "We", sales: 80 },
    { name: "Th", sales: 81 },
    { name: "Fr", sales: 56 },
    { name: "Sa", sales: 50 },
    { name: "Su", sales: 47 },
  ];

  const weekSales = weekChartData.reduce(
    (total, dataPoint) => total + dataPoint.sales,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getOrders();
        if (response && response.result) {
          setListData(
            response.result.map((row, index) => ({
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
              product_name: row.details[0].product_name.product_name,
              quantity: row.details[0].quantity,
              subtotal: row.details.reduce(
                (sum, detail) => sum + detail.subtotal,
                0
              ),
            }))
          );
          setTotalAmount(response.total_amount);
        }
        const usersResponse = await apiService.getUsers();
        if (usersResponse && usersResponse.result) {
          const index = usersResponse.result.length;
          setTotalUsers(index);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  },[]);
  return (
    <Layout>
      <Container sx={{ mt: 10 }}>
        {loading ? (
          <Loader />
        ) : (
          <Grid container spacing={3}>
            {/* Card for Budget */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Page Views
                  </Typography>
                  <Typography variant="h3">14,560</Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Card for Total Users */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h3">{totalUsers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Card for Total Amount */}
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Amount
                  </Typography>
                  <Typography variant="h3">$ {totalAmount}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={7}>
              <Paper elevation={0}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      This Month Statistics
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      $ {monthSales}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <LineChart width={600} height={400} data={monthChartData}>
                        <CartesianGrid
                          strokeDasharray="3 0"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis dataKey="name" tick={{ dy: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sales"
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </Box>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={0}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      This Week Statistics
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                      $ {weekSales}
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <BarChart width={400} height={400} data={weekChartData}>
                        <CartesianGrid
                          strokeDasharray="3 0"
                          horizontal={true}
                          vertical={false}
                        />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#80deea" barSize={30} />
                      </BarChart>
                    </Box>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Recent Orders
              </Typography>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listData.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.product_name}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>{order.payment_method}</TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell align="right">${order.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Layout>
  );
}

export default Dashboard;
