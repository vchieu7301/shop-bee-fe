import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/order/Orders";
import Users from "./pages/user/Users";
import Products from "./pages/product/Products"
import Categories from "./pages/category/Categories";
import ChangePassword from "./pages/user/ChangePassword";
import Login from "./users/pages/auth/Auth";
import SignUp from "./users/pages/auth/SignUp";
import { Home } from "@mui/icons-material";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="change-password" element={<ChangePassword />} />
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
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
      {/* </LayoutProvider> */}
    </Router>
  );
};

export default AppRouter;
