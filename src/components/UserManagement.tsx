import { useState } from "react";
import { User } from "@/lib/mock-data";
import { createUser, deleteUser } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, UserPlus, Users } from "lucide-react";

interface Props {
  users: User[];
  onUsersChange: () => void;
}

const UserManagement = ({ users, onUsersChange }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formUsername, setFormUsername] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<string>("technicien");
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setFormUsername("");
    setFormName("");
    setFormEmail("");
    setFormPassword("");
    setFormRole("technicien");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formUsername || !formName || !formEmail || !formPassword || !formRole) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      await createUser({
        username: formUsername,
        full_name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      });
      toast.success("Utilisateur créé avec succès");
      setDialogOpen(false);
      onUsersChange();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("Utilisateur supprimé");
      onUsersChange();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gestion des Utilisateurs
        </h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openCreate}>
              <UserPlus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel utilisateur</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Nom d'utilisateur</Label>
                <Input value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="nom.utilisateur" />
              </div>
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nom complet" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="email@exemple.com" />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Mot de passe" />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technicien">Technicien</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSave} className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur</TableHead>
                <TableHead>Nom complet</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.username}</TableCell>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
