import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function ProtectedRoute({ children }) {
  const { userInfo, token, isLoading, isInitialized } = useContext(UserContext);
  const location = useLocation();

  // Don't render anything until auth is initialized
  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  // Only redirect after we're sure about auth state
  if (!token || !userInfo) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
