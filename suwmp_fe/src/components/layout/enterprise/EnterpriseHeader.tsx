import { Bell, Download } from "lucide-react";

interface EnterpriseHeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const EnterpriseHeader = ({
  title = "Operations Dashboard",
  subtitle = "Real-time overview of waste processing operations",
  actions,
}: EnterpriseHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          {(title || subtitle) && (
            <div className="flex-1">
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-base text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {actions || (
              <>
                <button 
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors shadow-sm"
                  title="Export"
                >
                  <Download size={16} />
                  Export
                </button>
                <button 
                  className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default EnterpriseHeader;
