import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AppRouter from "./router";
import { LayoutProvider } from "./context/LayoutContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CssBaseline } from "@mui/material";
import { CartProvider } from "./users/context/CartContext";

createRoot(document.getElementById("root")).render(
  <LayoutProvider>
    <ThemeProvider>
      <CartProvider>
        <CssBaseline />
        <AppRouter />
      </CartProvider>
    </ThemeProvider>
  </LayoutProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
