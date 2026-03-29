import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (isAdminOnly && user.role !== "Admin") {
    // Not an admin but trying to access an admin-only route
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
