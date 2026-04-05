import { useState, useEffect, useCallback } from "react";
import { Intervention } from "@/lib/mock-data";
import { fetchInterventions } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import InterventionsTable from "@/components/InterventionsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle, LayoutDashboard } from "lucide-react";

const sections = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "interventions", label: "Interventions", icon: FileText },
];

const DirecteurDashboard = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSolved, setFilterSolved] = useState<string>("all");
  const [activeSection, setActiveSection] = useState("dashboard");

  const loadInterventions = useCallback(async () => {
    try {
      const data = await fetchInterventions();
      setInterventions(data);
    } catch (err) {
      console.error("Erreur chargement interventions:", err);
    }
  }, []);

  useEffect(() => { loadInterventions(); }, [loadInterventions]);

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
    { label: "Interventions", value: totalInterventions, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Résolues", value: solved, icon: CheckCircle, color: "bg-success/10 text-success" },
    { label: "Non résolues", value: unsolved, icon: AlertCircle, color: "bg-warning/10 text-warning" },
  ];

  return (
    <div className="flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} sections={sections} />
      <DashboardLayout title="Tableau de Bord Directeur" subtitle="Consultez toutes les interventions">
        {activeSection === "dashboard" && (
          <div className="grid gap-4 sm:grid-cols-3">
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
          <InterventionsTable interventions={filteredInterventions} showUser />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DirecteurDashboard;
