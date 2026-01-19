import Header from './Header'
import { Outlet } from 'react-router'
import Footer from './Footer'

function CitizenMain() {
    return (
        <div className='min-h-screen w-full flex flex-col gap-4 bg-background p-6'>   
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default CitizenMain
