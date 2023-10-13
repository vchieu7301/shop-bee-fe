import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/order/Orders";
import Users from "./pages/user/Users";
import Products from "./pages/product/Products"
import Categories from "./pages/category/Categories";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<Auth />} />
      <Route path="orders" element={<Orders />} />
      <Route path="users" element={<Users />} />
      <Route path="products" element={<Products />} />
      <Route path="categories" element={<Categories />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <Router>
    {/* <LayoutProvider> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
      {/* </LayoutProvider> */}
    </Router>
  );
};

export default AppRouter;
