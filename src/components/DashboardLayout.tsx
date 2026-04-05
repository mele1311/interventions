import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="ml-60 min-h-screen bg-background flex-1">
      <header className="sticky top-0 z-30 h-16 bg-card border-b border-border flex items-center px-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </header>
      <main className="p-8 space-y-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
