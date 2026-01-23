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

const menu = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Requests", icon: ClipboardList },
  { label: "Collectors", icon: Users },
  { label: "Service Areas", icon: Map },
  { label: "Capacity", icon: Layers },
  { label: "Reports", icon: BarChart },
  { label: "Export", icon: Download },
];

const EnterpriseSidebar = () => {
  return (
    <aside className="w-60 bg-muted h-screen border-r p-4 shadow-xl shadow-gray-300">
      <div className="flex items-center gap-4">
        <div className="mb-6 p-2 bg-linear-to-br from-orange-300 to-orange-600 rounded-xl inline-flex">
          <Building2 className="text-white" size={28} />
        </div>
        <h1 className="text-xl font-bold mb-6">Enterprise</h1>
      </div>

      <nav className="space-y-2">
        {menu.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-2xl text-gray-700 hover:bg-orange-500 hover:text-white cursor-pointer"
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default EnterpriseSidebar;
