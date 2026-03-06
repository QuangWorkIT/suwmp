import { useAppSelector } from '@/redux/hooks';
import { Settings } from 'lucide-react';
import { Link } from 'react-router';


function UserProfileBadge() {
    const { user } = useAppSelector(state => state.user)

    return (
        <div className="flex items-center justify-between gap-3 p-3 pl-5 rounded-2xl bg-primary/10 
        hover:cursor-pointer hover:bg-primary/20 transition-all duration-200 ease-in-out">
            <Link 
                to="/citizen/profile"
                className="flex gap-3 items-center flex-1"
            >
                <div className="w-9 h-9 rounded-full eco-gradient text-white 
                flex items-center justify-center font-bold text-md">
                    {user ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                    <p className="font-medium text-sm max-w-[110px] truncate">
                        {user?.fullName || "User"}
                    </p>

                    <p className="text-muted-foreground text-xs max-w-[110px] truncate">
                        {user?.email || "N/A"}
                    </p>
                </div>
            </Link>

            <div className='hover:cursor-pointer p-2 rounded-[10px] hover:bg-foreground/5
                transition-all duration-200 ease-in-out hover:scale-110'>
                <Settings size={18} className="text-muted-foreground ml-auto" />
            </div>
        </div>
    )
}

export default UserProfileBadge
