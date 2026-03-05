import UserProfileBadge from "@/components/common/UserProfileBadge";
import {
    Recycle,
    House,
    Plus,
    FileText,
    Trophy,
    MessageSquare,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";

function Sidebar() {
    const location = useLocation();

    const sidebarItems = [
        {
            icon: <House size={18} />,
            label: "Dashboard",
            path: "/citizen/dashboard",
        },
        {
            icon: <Plus size={18} />,
            label: "New Report",
            path: "/citizen/new-report",
        },
        {
            icon: <FileText size={18} />,
            label: "My Reports",
            path: "/citizen/reports",
        },
        {
            icon: <Trophy size={18} />,
            label: "Leaderboard",
            path: "/citizen/leaderboard",
        },
        {
            icon: <MessageSquare size={18} />,
            label: "Feedback",
            path: "/citizen/feedback",
        },
    ];

    return (
        <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            className="fixed left-0 top-0 w-[250px] min-h-screen 
        border-r border-foreground/20 flex flex-col bg-[#DAE7DE]/40"
        >
            <div className="">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex items-center gap-2 hover:cursor-pointer p-6"
                >
                    {/* Gradient logo */}
                    <div className="p-3 rounded-2xl eco-gradient shadow-md">
                        <Recycle size={20} className="text-white" />
                    </div>

                    {/* Brand name */}
                    <h1 className="text-xl font-bold text-gradient">EcoCollect</h1>
                </motion.div>
                <div className="px-4 text-sm">
                    <ul className="space-y-2">
                        {sidebarItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.label} to={`${item.path}`}>
                                    <motion.li
                                        className={`relative flex items-center gap-3 p-4 pl-5 rounded-2xl hover:cursor-pointer overflow-hidden 
                                            ${!isActive ? "hover:bg-primary/10" : ""}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-primary shadow-md rounded-2xl"
                                                initial={false}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <div
                                            className={`relative z-10 flex items-center gap-3 ${isActive ? "text-white font-medium" : ""
                                                }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    </motion.li>
                                </Link>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* User profile */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3 border-t border-foreground/20 mt-auto"
            >
                <Link to="/citizen/profile">
                    <UserProfileBadge />
                </Link>
            </motion.div>
        </motion.aside>
    );
}

export default Sidebar;

