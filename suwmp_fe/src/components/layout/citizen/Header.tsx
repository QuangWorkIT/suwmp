import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/redux/hooks';
import { Bell, Plus } from 'lucide-react';

function Header() {
    const { user } = useAppSelector(state => state.user)

    return (
        <header className="fixed top-0 left-[250px] w-[calc(100%-250px)]
        bg-white/50 px-6 py-5 border-b border-foreground/20 flex 
        justify-between items-center backdrop-blur-xl backdrop-saturate-200">
            <div className="cursor-default">
                <h1 className='text-2xl font-bold'>Welcome back, {user ? user.fullName : "Guest"}</h1>
                <p className="text-muted-foreground text-sm">Here's your environmental impact overview</p>
            </div>
            <div className="flex items-center gap-4">
                <div className='hover:cursor-pointer p-3 rounded-[10px] hover:bg-foreground/5
                transition-all duration-200 ease-in-out'>
                    <Bell size={22} />
                </div>
                <Button className='rounded-[10px] px-6 py-5'>
                    <Plus /> New Report
                </Button>
            </div>
        </header>
    )
}

export default Header
