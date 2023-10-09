import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/dashboard/Dashboard";
import Order from "./pages/order/Orders";
import User from "./pages/user/User";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="login" element={<Auth />} />
      <Route path="order" element={<Order />} />
      <Route path="user" element={<User />} />
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
