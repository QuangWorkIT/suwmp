import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  description: string;
  showAddButton?: boolean;
  buttonText?: string;
}

function AdminHeader({
  title = "Admin Dashboard",
  description = "Manage your platform",
  showAddButton = false,
  buttonText = "Add User",
}: AdminHeaderProps) {
  return (
    <header
      className="fixed top-0 left-[250px] w-[calc(100%-250px)]
        bg-white px-6 py-4 border-b border-foreground/10 flex 
        justify-between items-center shadow-sm z-40"
    >
      {/* Page Title */}
      <div className="cursor-default">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div
          className="hover:cursor-pointer p-2.5 rounded-lg hover:bg-gray-100
                transition-all duration-200 ease-in-out"
        >
          <Bell size={20} className="text-gray-600" />
        </div>

        {/* Dynamic Action Button */}
        {showAddButton && (
          <Button
            className="rounded-lg px-5 py-5 bg-purple-600 hover:bg-purple-700 text-white cursor-pointer
                    shadow-sm transition-all duration-200"
          >
            <Plus size={18} className="mr-2" />
            {buttonText}
          </Button>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
