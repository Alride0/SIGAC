import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.role !== "admin") {
    return <Navigate to="/clients" replace />;
  }

  return children;
};

export default AdminRoute;