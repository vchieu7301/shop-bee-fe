import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Components/admin/auth/Auth";
import Dashboard from "./Components/admin/dashboard/Dashboard";
import Order from "./Components/admin/order/Order";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<Auth />} />
      <Route path="order" element={<Order />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
