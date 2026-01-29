import UserProfileBadge from "@/components/common/UserProfileBadge";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Map,
  Layers,
  BarChart,
  Download,
  Building2,
} from "lucide-react";
import { NavLink } from "react-router";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "dashboard" },
  { label: "Requests", icon: ClipboardList, path: "requests" },
  { label: "Collectors", icon: Users, path: "collectors" },
  { label: "Service Areas", icon: Map, path: "areas" },
  { label: "Capacity", icon: Layers, path: "capacity" },
  { label: "Reports", icon: BarChart, path: "reports" },
  { label: "Export", icon: Download, path: "export" },
];

const EnterpriseSidebar = () => {
  return (
    <aside className="w-60 flex flex-col bg-muted h-screen border-r p-4 shadow-xl shadow-gray-300">
      <div className="flex items-center gap-4">
        <div className="mb-6 p-2 bg-linear-to-br from-orange-300 to-orange-600 rounded-xl inline-flex">
          <Building2 className="text-white" size={28} />
        </div>
        <h1 className="text-xl font-bold mb-6">Enterprise</h1>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-orange-300 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-foreground/20 mt-auto justify-end">
        <UserProfileBadge />
      </div>
    </aside>
  );
};

export default EnterpriseSidebar;
