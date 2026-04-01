import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import DirecteurDashboard from "./DirecteurDashboard";

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "directeur") return <DirecteurDashboard />;
  return <UserDashboard />;
};

export default Dashboard;
