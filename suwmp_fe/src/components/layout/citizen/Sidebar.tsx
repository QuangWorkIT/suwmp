import UserProfileBadge from '@/components/common/UserProfileBadge';
import { Recycle, House, Plus, FileText, Trophy, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router';


function Sidebar() {
    const location = useLocation()
    console.log(location)

    const sidebarItems = [
        { icon: <House size={18} />, label: "Dashboard", path: "/citizen/dashboard" },
        { icon: <Plus size={18} />, label: "New Report", path: "/citizen/new-report" },
        { icon: <FileText size={18} />, label: "My Reports", path: "/citizen/reports" },
        { icon: <Trophy size={18} />, label: "Leaderboard", path: "/citizen/leaderboard" },
        { icon: <MessageSquare size={18} />, label: "Feedback", path: "/citizen/feedback" },
    ]


    return (
        <aside className="fixed left-0 top-0 min-w-[250px] min-h-screen 
        border-r border-foreground/20 flex flex-col bg-[#DAE7DE]/40">
            <div className="">
                <div className="flex items-center gap-2 hover:cursor-pointer p-6">
                    {/* Gradient logo */}
                    <div className="p-3 rounded-2xl eco-gradient shadow-md">
                        <Recycle size={20} className="text-white" />
                    </div>

                    {/* Brand name */}
                    <h1 className="text-xl font-bold text-gradient">
                        EcoCollect
                    </h1>
                </div>
                <div className="px-4 text-sm">
                    <ul>
                        {sidebarItems.map((item) => {
                            return (
                                <Link
                                    key={item.label}
                                    to={`${item.path}`}>
                                    <li className={`flex items-center gap-3 p-4 pl-5 rounded-2xl hover:cursor-pointer
                                    ${location.pathname === `${item.path}`
                                            ? "bg-primary text-white font-medium shadow-md"
                                            : "hover:bg-primary/10"}`}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                </div>
            </div>

            {/* User profile */}
            <div className="p-3 border-t border-foreground/20 mt-auto">
                <UserProfileBadge />
            </div>

        </aside>
    )
}

export default Sidebar
