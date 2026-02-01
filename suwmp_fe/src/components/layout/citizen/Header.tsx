import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { Bell, Plus } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";

function Header() {
    const { user } = useAppSelector((state) => state.user);

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-[250px] w-[calc(100%-250px)]
            bg-white/50 px-6 py-5 border-b border-foreground/20 flex 
            justify-between items-center backdrop-blur-xl backdrop-saturate-200"
        >
            <div className="cursor-default">
                <motion.h1
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-2xl font-bold"
                >
                    Welcome back, {user ? user.fullName : "Guest"}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-muted-foreground text-sm"
                >
                    Here's your environmental impact overview
                </motion.p>
            </div>
            <div className="flex items-center gap-4">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:cursor-pointer p-3 rounded-[10px] hover:bg-foreground/5
            transition-colors duration-200 ease-in-out"
                >
                    <Bell size={22} />
                </motion.div>
                <Link to="/citizen/new-report">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="rounded-[10px] px-6 py-5 shadow-sm">
                            <Plus /> New Report
                        </Button>
                    </motion.div>
                </Link>
            </div>
        </motion.header>
    );
}

export default Header;

