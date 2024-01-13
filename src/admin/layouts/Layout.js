// Layout.js
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1}}>
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;
