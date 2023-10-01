// Layout.js
import React from "react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

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
