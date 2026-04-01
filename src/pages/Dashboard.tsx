import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <AdminDashboard /> : <UserDashboard />;
};

export default Dashboard;
