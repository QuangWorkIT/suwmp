import CollectorSidebar from './CollectorSidebar'
import { Outlet } from 'react-router'

function CollectorMain() {
    return (
        <div className='flex min-h-screen bg-background'>
            <div className="hidden lg:block w-[250px] z-50 bg-[#DAE7DE]/40 border-r border-sidebar-border">
                <CollectorSidebar />
            </div>
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    )
}

export default CollectorMain