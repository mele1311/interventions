import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
