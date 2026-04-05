import { useAuth } from "@/lib/auth-context";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: { id: string; label: string; icon: React.ElementType }[];
}

const Sidebar = ({ activeSection, onSectionChange, sections }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-card border-r border-border flex flex-col z-40">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border shrink-0">
        <Wrench className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-foreground">Interventions</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => onSectionChange(s.id)}
            className={cn(
              "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeSection === s.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <s.icon className="h-5 w-5 shrink-0" />
            {s.label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      {user && (
        <div className="border-t border-border p-4 space-y-3 shrink-0">
          <div className="text-sm">
            <p className="font-medium text-foreground truncate">{user.full_name}</p>
            <p className="text-muted-foreground text-xs capitalize">{user.role}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
