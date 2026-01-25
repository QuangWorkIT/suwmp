import Header from './Header'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

function CitizenMain() {
    return (
        <div className='bg-background w-full'>
            <Sidebar />

            <div className="ml-[250px] mt-[110px]">
                <Header />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default CitizenMain
