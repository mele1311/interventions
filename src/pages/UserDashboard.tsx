import { useState, useEffect, useCallback } from "react";
import { Intervention } from "@/lib/mock-data";
import { fetchInterventions, createIntervention } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import DashboardLayout from "@/components/DashboardLayout";
import InterventionForm from "@/components/InterventionForm";
import InterventionsTable from "@/components/InterventionsTable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, LayoutDashboard, FileText } from "lucide-react";

const sections = [
  { id: "dashboard", label: "Mes Interventions", icon: LayoutDashboard },
];

const UserDashboard = () => {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const loadInterventions = useCallback(async () => {
    try {
      const data = await fetchInterventions();
      setInterventions(data);
    } catch (err: any) {
      toast.error("Erreur lors du chargement des interventions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInterventions();
  }, [loadInterventions]);

  const handleAdd = async (intervention: Omit<Intervention, "id" | "user_id" | "created_at">) => {
    try {
      await createIntervention(intervention);
      toast.success("Intervention soumise avec succès !");
      setShowForm(false);
      loadInterventions();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la soumission");
    }
  };

  return (
    <div className="flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} sections={sections} />
      <DashboardLayout title="Mon Tableau de Bord" subtitle="Soumettez et suivez vos interventions">
        <div className="flex items-center justify-end">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle Intervention
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Mes Interventions</h2>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : (
            <InterventionsTable interventions={interventions} editable onUpdated={loadInterventions} />
          )}
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle Intervention</DialogTitle>
            </DialogHeader>
            <InterventionForm onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </div>
  );
};

export default UserDashboard;
