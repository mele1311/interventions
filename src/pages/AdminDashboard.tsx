import { useState, useEffect, useCallback } from "react";
import { User, Intervention } from "@/lib/mock-data";
import { fetchUsers, fetchInterventions } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterventionsTable from "@/components/InterventionsTable";
import UserManagement from "@/components/UserManagement";
import { Users, FileText, CheckCircle, AlertCircle, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

const sections = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "interventions", label: "Interventions", icon: FileText },
  { id: "users", label: "Utilisateurs", icon: Users },
];

const AdminDashboard = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSolved, setFilterSolved] = useState<string>("all");
  const [activeSection, setActiveSection] = useState("dashboard");

  const loadData = useCallback(async () => {
    try {
      const [usersData, interventionsData] = await Promise.all([
        fetchUsers(),
        fetchInterventions(),
      ]);
      setUsers(usersData);
      setInterventions(interventionsData);
    } catch (err: any) {
      toast.error("Erreur lors du chargement des données");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalUsers = users.length;
  const totalInterventions = interventions.length;
  const solved = interventions.filter((i) => i.is_solved).length;
  const unsolved = totalInterventions - solved;

  const filteredInterventions = interventions.filter((i) => {
    const matchesSearch =
      i.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.problem_description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterSolved === "all" ||
      (filterSolved === "solved" && i.is_solved) ||
      (filterSolved === "unsolved" && !i.is_solved);
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: "Utilisateurs", value: totalUsers, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Interventions", value: totalInterventions, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Résolues", value: solved, icon: CheckCircle, color: "bg-success/10 text-success" },
    { label: "Non résolues", value: unsolved, icon: AlertCircle, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} sections={sections} />
      <DashboardLayout title="Tableau de Bord Administrateur" subtitle="Gérez les utilisateurs et les interventions">
        {(activeSection === "dashboard" || activeSection === "interventions") && (
          <>
            {activeSection === "dashboard" && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Toutes les Interventions</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Rechercher par nom, lieu, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={filterSolved} onValueChange={setFilterSolved}>
                  <SelectTrigger className="sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="solved">Résolues</SelectItem>
                    <SelectItem value="unsolved">Non résolues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <InterventionsTable interventions={filteredInterventions} showUser editable onUpdated={loadData} />
            </div>
          </>
        )}

        {activeSection === "users" && (
          <UserManagement users={users} onUsersChange={loadData} />
        )}
      </DashboardLayout>
    </div>
  );
};

export default AdminDashboard;
