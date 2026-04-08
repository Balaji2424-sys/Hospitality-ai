import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function ProtectedRoute({ children, roles }) {
  const { auth } = useApp();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(auth.user?.role)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
