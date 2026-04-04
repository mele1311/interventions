import { useState, useEffect, useCallback } from "react";
import { Intervention } from "@/lib/mock-data";
import { fetchInterventions, createIntervention } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import InterventionForm from "@/components/InterventionForm";
import InterventionsTable from "@/components/InterventionsTable";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mon Tableau de Bord</h1>
            <p className="text-muted-foreground">Soumettez et suivez vos interventions</p>
          </div>
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
      </main>
    </div>
  );
};

export default UserDashboard;
