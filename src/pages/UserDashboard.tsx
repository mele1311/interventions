import { useState } from "react";
import { Intervention } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import InterventionForm from "@/components/InterventionForm";
import InterventionsTable from "@/components/InterventionsTable";

const UserDashboard = () => {
  const { user } = useAuth();
  // TODO: Remplacez par un appel API pour charger les interventions de l'utilisateur
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  const handleAdd = (intervention: Omit<Intervention, "id" | "user_id" | "created_at">) => {
    const newIntervention: Intervention = {
      ...intervention,
      id: String(Date.now()),
      user_id: user!.id,
      created_at: new Date().toISOString().split("T")[0],
    };
    setInterventions((prev) => [newIntervention, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mon Tableau de Bord</h1>
          <p className="text-muted-foreground">Soumettez et suivez vos interventions</p>
        </div>
        <InterventionForm onSubmit={handleAdd} />
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Mes Interventions</h2>
          <InterventionsTable interventions={interventions} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
