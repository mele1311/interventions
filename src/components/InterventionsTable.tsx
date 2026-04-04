import { useState } from "react";
import { Intervention } from "@/lib/mock-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Props {
  interventions: Intervention[];
  showUser?: boolean;
  editable?: boolean;
  onUpdated?: () => void;
}

const InterventionsTable = ({ interventions, showUser, editable, onUpdated }: Props) => {
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    problem_description: "",
    location: "",
    actions_taken: "",
    date_of_intervention: "",
    is_solved: "no",
  });
  const [loading, setLoading] = useState(false);

  const openEdit = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setFormData({
      full_name: intervention.full_name,
      problem_description: intervention.problem_description,
      location: intervention.location,
      actions_taken: intervention.actions_taken,
      date_of_intervention: intervention.date_of_intervention,
      is_solved: intervention.is_solved ? "yes" : "no",
    });
  };

  const handleUpdate = async () => {
    if (!editingIntervention) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${API_URL}/api/interventions/${editingIntervention.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          is_solved: formData.is_solved === "yes",
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour");
      toast.success("Intervention mise à jour avec succès");
      setEditingIntervention(null);
      onUpdated?.();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (interventions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune intervention trouvée.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {showUser && <TableHead>Nom</TableHead>}
                  <TableHead>Description</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  {editable && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {interventions.map((i) => (
                  <TableRow key={i.id}>
                    {showUser && <TableCell className="font-medium">{i.full_name}</TableCell>}
                    <TableCell className="max-w-[250px] truncate">{i.problem_description}</TableCell>
                    <TableCell>{i.location}</TableCell>
                    <TableCell>{new Date(i.date_of_intervention).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell>
                      <Badge variant={i.is_solved ? "default" : "destructive"} className={i.is_solved ? "bg-success text-success-foreground hover:bg-success/90" : ""}>
                        {i.is_solved ? "Résolu" : "Non résolu"}
                      </Badge>
                    </TableCell>
                    {editable && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(i)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingIntervention} onOpenChange={(open) => !open && setEditingIntervention(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'intervention</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 pt-2 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              <Input value={formData.full_name} onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Lieu</Label>
              <Input value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description du problème</Label>
              <Textarea value={formData.problem_description} onChange={(e) => setFormData((p) => ({ ...p, problem_description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Actions entreprises</Label>
              <Textarea value={formData.actions_taken} onChange={(e) => setFormData((p) => ({ ...p, actions_taken: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date_of_intervention} onChange={(e) => setFormData((p) => ({ ...p, date_of_intervention: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Résolu ?</Label>
              <Select value={formData.is_solved} onValueChange={(v) => setFormData((p) => ({ ...p, is_solved: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Button onClick={handleUpdate} className="w-full" disabled={loading}>
                {loading ? "Mise à jour..." : "Enregistrer"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterventionsTable;
