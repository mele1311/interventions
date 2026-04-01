import { useState } from "react";
import { Intervention } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  onSubmit: (intervention: Omit<Intervention, "id" | "user_id" | "created_at">) => void;
}

const InterventionForm = ({ onSubmit }: Props) => {
  const [fullName, setFullName] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [location, setLocation] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [date, setDate] = useState<Date>();
  const [isSolved, setIsSolved] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !problemDescription || !location || !actionsTaken || !date || !isSolved) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    onSubmit({
      full_name: fullName,
      problem_description: problemDescription,
      location,
      actions_taken: actionsTaken,
      date_of_intervention: format(date, "yyyy-MM-dd"),
      is_solved: isSolved === "yes",
    });
    setFullName("");
    setProblemDescription("");
    setLocation("");
    setActionsTaken("");
    setDate(undefined);
    setIsSolved("");
    toast.success("Intervention soumise avec succès !");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouvelle Intervention
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom complet" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Lieu de l'intervention" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="problem">Description du problème</Label>
            <Textarea id="problem" value={problemDescription} onChange={(e) => setProblemDescription(e.target.value)} placeholder="Décrivez le problème rencontré..." rows={3} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="actions">Actions entreprises</Label>
            <Textarea id="actions" value={actionsTaken} onChange={(e) => setActionsTaken(e.target.value)} placeholder="Décrivez les actions entreprises..." rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Date de l'intervention</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Choisir une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label>Problème résolu ?</Label>
            <Select value={isSolved} onValueChange={setIsSolved}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1" />
              Soumettre l'intervention
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InterventionForm;
