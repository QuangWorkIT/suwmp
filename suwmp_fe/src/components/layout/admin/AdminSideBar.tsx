import { CircleUser, LayoutDashboard, Users, Recycle, Settings, MapPinned, AlertCircle, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router';

function AdminSideBar() {
    const location = useLocation()

    const sidebarItems = [
        { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/admin/dashboard" },
        { icon: <Users size={18} />, label: "User Management", path: "/admin/users" },
        { icon: <Recycle size={18} />, label: "Waste Categories", path: "/admin/waste-categories" },
        { icon: <MapPinned size={18} />, label: "Regions & Zones", path: "/admin/regions" },
        { icon: <Settings size={18} />, label: "Policies", path: "/admin/policies" },
        { icon: <AlertCircle size={18} />, label: "Complaints", path: "/admin/complaints" },
        { icon: <BarChart3 size={18} />, label: "Audit Logs", path: "/admin/audit-logs" },
        { icon: <BarChart3 size={18} />, label: "Analytics", path: "/admin/analytics" },
        { icon: <Settings size={18} />, label: "Access Control", path: "/admin/access-control" },
    ]

    return (
        <aside className="fixed left-0 top-0 min-w-[250px] min-h-screen 
        border-r border-foreground/20 flex flex-col bg-[#f8f9fa]">
            <div className="">
                {/* Admin Panel Logo */}
                <div className="flex items-center gap-3 hover:cursor-pointer p-6 border-b border-foreground/10">
                    <div className="p-2 rounded-full bg-purple-600 shadow-md">
                        <CircleUser size={24} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                        Admin Panel
                    </h1>
                </div>

                {/* Sidebar Navigation */}
                <div className="px-4 py-4 text-sm">
                    <ul className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.label}
                                    to={`${item.path}`}>
                                    <li className={`flex items-center gap-3 p-3 pl-4 rounded-lg hover:cursor-pointer
                                    transition-all duration-200 ease-in-out
                                    ${isActive
                                            ? "bg-purple-600 text-white font-medium shadow-md"
                                            : "hover:bg-purple-50 text-gray-700"}`}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {/* System Admin Badge */}
            <div className="p-4 border-t border-foreground/10 mt-auto">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 rounded-full bg-green-600">
                        <CircleUser size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">System Admin</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>
                </div>
            </div>

        </aside>
    )
}

export default AdminSideBar
