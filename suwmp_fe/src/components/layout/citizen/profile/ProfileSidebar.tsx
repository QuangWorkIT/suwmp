// ProfileSidebar.jsx
import { User, Bell, Shield, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useAppDispatch } from "@/redux/hooks";
import { logoutAction } from "@/redux/features/userSlice";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function ProfileSidebar() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const sidebarItems = [
        {
            icon: <User size={18} />,
            label: "Profile Details",
            path: "/citizen/profile/details",
        },
        {
            icon: <Bell size={18} />,
            label: "Notifications",
            path: "",
        },
        {
            icon: <Shield size={18} />,
            label: "Privacy & Security",
            path: "",
        },
        {
            icon: <Settings size={18} />,
            label: "Account Settings",
            path: "",
        },
    ];

    const handleLogout = () => {
        navigate("/", { replace: true });

        setTimeout(async () => {
            try {
                await AuthService.logout();
                dispatch(logoutAction());
                toast.success("Logout successful");
            } catch (error) {
                console.error(error);
                toast.error("Logout failed");
            }
        }, 0);
    };

    return (
        <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">

                {sidebarItems.map(item => {
                    const isActive = location.pathname === item.path;

                    return (
                        <Link key={item.label} to={item.path}>
                            <div
                                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                    ${isActive 
                                        ? "bg-green-50 text-green-700" 
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}

                <div className="pt-6 border-t border-gray-100">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
                
            </nav>
        </div>
    );
}

export default ProfileSidebar;