import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import loginIllustration from "@/assets/login-illustration.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      } else {
        toast.error("Identifiants invalides");
      }
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-4xl bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left branding panel */}
        <div className="md:w-1/2 bg-primary flex flex-col items-center justify-center p-10 text-primary-foreground">
          <h1 className="text-3xl font-bold text-center">Direction Technique</h1>
          <p className="text-lg mt-2 text-center opacity-90">Gestion des interventions</p>
          <img
            src={loginIllustration}
            alt="Technicien effectuant une intervention"
            width={220}
            height={220}
            className="mt-8"
          />
        </div>

        {/* Right form panel */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-foreground">Connexion</h2>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Connectez-vous à votre compte</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
