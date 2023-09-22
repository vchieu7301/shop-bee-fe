import React, { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "./Chart";

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
            Authorization:
              "Bearer " + localStorage.getItem("PersonalAccessToken"),
          },
        });
        setListData(response.data.result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [navigate, apiUrl]);
  listData.forEach((item) => {
    <Chart orders={item.details} />
  });
  return (
    <React.Fragment>
      <Title>Recent Orders</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Ship To</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell align="right">Sale Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listData ? (
            listData.map((row) => (
              <TableRow key={row.order.id}>
                <TableCell>{row.order.order_date}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.order.shipping_address}</TableCell>
                <TableCell>{row.order.payment_method}</TableCell>
                <TableCell align="right">
                  {row.details.map((detail, index) => (
                    <div key={index}>{detail.subtotal}</div>
                  ))}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={(event) => preventDefault(event)}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
