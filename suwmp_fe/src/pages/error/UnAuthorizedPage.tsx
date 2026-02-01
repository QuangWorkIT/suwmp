import { Button } from "@/components/ui/button";
import { ShieldAlert, Home, LogIn } from "lucide-react";
import { useNavigate } from "react-router";

function UnAuthorizedPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
            <div className="flex flex-col items-center max-w-md w-full gap-6">
                <div className="rounded-full bg-destructive/10 p-4 ring-1 ring-destructive/20">
                    <ShieldAlert className="size-12 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        You do not have permission to view this page. Please log in with an appropriate account or return to the home page.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto"
                    >
                        <Home className="mr-2 size-4" />
                        Return Home
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => navigate("/signin")}
                        className="w-full sm:w-auto"
                    >
                        <LogIn className="mr-2 size-4" />
                        Go to Login
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default UnAuthorizedPage
