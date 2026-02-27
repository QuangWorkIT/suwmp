import { Link, useLocation } from "react-router"
import {
    Truck,
    Navigation,
    Home,
    List,
    History,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/collector/dashboard" },
    { icon: List, label: "My Tasks", href: "/collector/tasks" },
    { icon: Navigation, label: "Route Map", href: "/collector/route" },
    { icon: History, label: "History", href: "/collector/history" },
];

function CollectorSidebar() {
    const path = useLocation().pathname

    return (
        <div className="">
            <motion.aside
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
                className="hidden lg:flex flex-col"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="p-6"
                >
                    <Link to="/collector" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center
                        justify-center shadow-md">
                            <Truck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                            Collector Hub
                        </span>
                    </Link>
                </motion.div>

                <nav className="flex-1 px-3">
                    <ul className="space-y-1">
                        {navItems.map((item, index) => {
                            const isActive = path === item.href;
                            return (
                                <Link key={item.href} to={item.href}>
                                    <motion.li
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3 + index * 0.08,
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 120,
                                            damping: 20,
                                        }}
                                        className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium overflow-hidden
                                            ${!isActive ? "hover:bg-sidebar-accent" : ""}`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="collectorActiveTab"
                                                className="absolute inset-0 bg-blue-600 shadow-md rounded-xl"
                                                initial={false}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <div
                                            className={`relative z-10 flex items-center gap-3 transition-colors
                                                ${isActive ? "text-white font-medium" : "text-sidebar-foreground"
                                            }`}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </div>
                                    </motion.li>
                                </Link>
                            );
                        })}
                    </ul>
                </nav>
            </motion.aside>
        </div>
    )
}

export default CollectorSidebar