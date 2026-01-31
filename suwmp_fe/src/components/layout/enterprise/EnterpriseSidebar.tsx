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
import { Link, useLocation } from "react-router";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/enterprise/dashboard" },
  { label: "Requests", icon: ClipboardList, path: "/enterprise/requests" },
  { label: "Collectors", icon: Users, path: "/enterprise/collectors" },
  { label: "Service Areas", icon: Map, path: "/enterprise/areas" },
  { label: "Capacity", icon: Layers, path: "/enterprise/capacity" },
  { label: "Reports", icon: BarChart, path: "/enterprise/reports" },
  { label: "Export", icon: Download, path: "/enterprise/export" },
];

const EnterpriseSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-sidebar border-r border-sidebar-border hidden lg:flex flex-col">
      <div className="p-6">
        <Link to="/enterprise" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Enterprise</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menu.map((item) => (
          <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all 
            ${item.path === location.pathname ? "bg-amber-600 text-white shadow-md hover:scale-105" : "text-sidebar-foreground hover:bg-sidebar-accent"
            } cursor-pointer`}>
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <UserProfileBadge />
      </div>
    </aside>
  );
};

export default EnterpriseSidebar;
