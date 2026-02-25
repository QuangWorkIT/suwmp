import { Outlet } from "react-router"
import Header from "./Header"
import Footer from "./Footer"

function PublicMain() {
    return (
        <div className="min-h-screen w-full flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicMain
