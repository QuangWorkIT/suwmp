import { Link } from "react-router"
import { motion } from "framer-motion" // Added motion import
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Recycle,
    Users,
    Plus,
    FileText,
    Eye,
    Trophy,
    BarChart3,
    Upload,
    Truck,
    Star,
} from "lucide-react"

function PublicHome() {
    // TODO: Replace with actual data from API/state
    const mockStats = [
        { label: "Active Citizens", value: "50K+", icon: Users },
        { label: "kg Recycled", value: "2.5M", icon: Recycle },
        { label: "Collections", value: "120+", icon: Truck },
        { label: "Satisfaction", value: "98%", icon: Trophy },
    ]

    const mockHeroFeatures = [
        {
            title: "Easy Sorting",
            description: "Visual guides for proper waste classification.",
            icon: Recycle,
            iconColor: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Live Tracking",
            description: "Real-time status of your waste reports.",
            icon: Eye,
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Rewards",
            description: "Earn points and unlock exclusive badges.",
            icon: Trophy,
            iconColor: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Analytics",
            description: "Track your environmental impact.",
            icon: BarChart3,
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ]

    const mockHowItWorks = [
        {
            title: "Smart Reporting",
            description: "Upload photos and easily classify your waste automatically with AI-powered mapping.",
            icon: Upload,
        },
        {
            title: "Efficient Collection",
            description: "Real-time tracking and optimized routes for faster, greener waste collection.",
            icon: Truck,
        },
        {
            title: "Earn Rewards",
            description: "Get points for proper recycling and climb the community leaderboard.",
            icon: Trophy,
        },
        {
            title: "Track Impact",
            description: "See your environmental impact with detailed analytics and reports.",
            icon: BarChart3,
        },
    ]

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 via-primary/5 to-background py-12 sm:py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div // Wrapped Hero section content
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16"
                    >
                        {/* Left Content */}
                        <div>
                            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                                AI-Powered Waste Classification
                            </Badge>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Smart Waste Management for{" "}
                                <span className="text-primary">Greener Communities</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-muted-foreground">
                                Join thousands of citizens, collectors, and enterprises working
                                together to create sustainable neighborhoods through intelligent
                                waste collection and recycling.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <Button size="lg" asChild>
                                    <Link to="/citizen">
                                        Get Started Now
                                        <Plus className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link to="/wasteguide">
                                        Waste Sorting Guide
                                        <FileText className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                            {/* Social Proof */}
                            <div className="mt-8 flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-5 w-5 fill-primary text-primary"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Join 50,000+ citizens making a difference worldwide.
                                </span>
                            </div>
                        </div>

                        {/* Right Feature Cards Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {mockHeroFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <motion.div
                                        key={feature.title}
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card className="border-0 shadow-md h-full">
                                            <CardHeader>
                                                <div
                                                    className={`mb-3 w-fit rounded-lg p-3 ${feature.bgColor}`}
                                                >
                                                    <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                                                </div>
                                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription className="text-sm">
                                                    {feature.description}
                                                </CardDescription>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border bg-muted/30 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                        {mockStats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                                <div className="mt-2 text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div // Wrapped How It Works section content
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                How It Works
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                A seamless experience from waste reporting to collection and recycling
                            </p>
                        </div>
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {mockHowItWorks.map((step) => {
                                const Icon = step.icon
                                return (
                                    <motion.div
                                        key={step.title}
                                        whileHover={{ y: -5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Card className="border-0 shadow-md h-full">
                                            <CardHeader>
                                                <div className="mb-4 rounded-lg bg-primary/10 w-fit p-3">
                                                    <Icon className="h-6 w-6 text-primary" />
                                                </div>
                                                <CardTitle>{step.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <CardDescription>{step.description}</CardDescription>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Ready to Make a Difference Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold sm:text-3xl">
                                Ready to Make a Difference?
                            </CardTitle>
                            <CardDescription className="mt-4 text-base">
                                Join our growing community of eco-conscious citizens and help build a
                                sustainable future for your neighborhood.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4 pb-8 sm:flex-row sm:justify-center">
                            <Button size="lg" asChild>
                                <Link to="/citizen">
                                    Join EcoCollect Today
                                    <Plus className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="link" asChild>
                                <Link to="/citizen">I already have an Account</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    )
}

export default PublicHome
