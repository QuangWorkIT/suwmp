import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Menu, X, Recycle, User, LogIn, UserPlus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAppSelector } from "@/redux/hooks"
import { roleNavigation } from "@/pages/authentication/LoginPage"

function Header() {
    const { user } = useAppSelector(state => state.user)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const location = { pathname: "/" } // Mock for demo

    const mockNavigation = [
        { name: "Home", path: "/" },
        { name: "Waste Guide", path: "/wasteguide" },
        { name: "About", path: "/about" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex flex-1 items-center">
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <Recycle className="h-6 w-6 text-primary" />
                        <span className="text-xl font-semibold text-foreground">Eco-Collect</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex pl-12">
                    {mockNavigation.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "relative text-sm font-medium transition-colors hover:text-primary py-1",
                                    isActive ? "text-primary" : "text-foreground/70"
                                )}
                            >
                                {item.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Auth Dropdown */}
                <div className="hidden md:flex flex-1 items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/30 transition-all shadow-sm"
                            >
                                <User className="h-6 w-6 text-primary" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-64 p-3"
                            sideOffset={8}
                        >
                            <DropdownMenuLabel className="font-normal px-0">
                                <div className="flex flex-col space-y-1 p-3">
                                    <p className="text-sm font-medium leading-none">Welcome to Eco-Collect</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        Join our green community
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-2" />

                            {/* Sign In */}
                            {!user && (
                                <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent">
                                    <Link
                                        to="/signin"
                                        className="flex items-center gap-3 w-full p-3 hover:bg-primary focus:bg-primary transition-colors duration-200 group rounded-md"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 group-hover:bg-white/20 transition-colors duration-200">
                                            <LogIn className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground group-hover:text-white transition-colors duration-200">Sign In</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-white/80">Access your account</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            )}

                            {user && (
                                <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent">
                                    <Link
                                        to={roleNavigation[user.role]}
                                        className="flex items-center gap-3 w-full p-3 hover:bg-primary focus:bg-primary transition-colors duration-200 group rounded-md"
                                    >
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 group-hover:bg-white/20 transition-colors duration-200">
                                            <LogIn className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground group-hover:text-white transition-colors duration-200">Go to dashboard</span>
                                            <span className="text-xs text-muted-foreground group-hover:text-white/80">Manage your account</span>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            {/* Get Started */}
                            <DropdownMenuItem className="p-0 focus:bg-transparent hover:bg-transparent mt-1">
                                <Link
                                    to="/signup"
                                    className="flex items-center gap-3 w-full p-3 hover:bg-primary focus:bg-primary transition-colors duration-200 group rounded-md"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 group-hover:bg-white/20 transition-colors duration-200">
                                        <UserPlus className="h-4.5 w-4.5 text-primary group-hover:text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground group-hover:text-white transition-colors duration-200">Get Started</span>
                                        <span className="text-xs text-muted-foreground group-hover:text-white/80">Create a new account</span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    className="md:hidden ml-auto"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-background md:hidden">
                    <div className="space-y-1 px-4 pb-4 pt-2">
                        {mockNavigation.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-foreground hover:bg-muted"
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border mt-4">
                            <Button variant="outline" asChild className="w-full">
                                <Link to="/citizen/signin" onClick={() => setMobileMenuOpen(false)}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                            <Button asChild className="w-full">
                                <Link to="/citizen/signup" onClick={() => setMobileMenuOpen(false)}>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Get Started
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header