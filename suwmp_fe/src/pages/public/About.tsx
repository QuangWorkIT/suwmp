import { Link } from "react-router"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Recycle,
    Users,
    Target,
    Eye,
    Heart,
    Leaf,
    Mail,
    Phone,
    MapPin,
    Globe,
    Award,
    TrendingUp,
    Zap,
    Shield,
} from "lucide-react"

function About() {
    // TODO: Replace with actual data from API/state
    const mockMission = {
        title: "Our Mission",
        description:
            "To empower communities with intelligent waste management solutions that make sustainability accessible, rewarding, and impactful for everyone.",
    }

    const mockVision = {
        title: "Our Vision",
        description:
            "A world where waste is transformed into resources, where every community actively participates in building a circular economy, and where sustainability is not just a goal but a way of life.",
    }

    const mockValues = [
        {
            title: "Sustainability First",
            description: "Every decision we make prioritizes environmental impact and long-term sustainability.",
            icon: Leaf,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Community Driven",
            description: "We believe in the power of communities working together for a common goal.",
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Innovation",
            description: "Leveraging AI and technology to make waste management smarter and more efficient.",
            icon: Zap,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Transparency",
            description: "Building trust through open communication and clear impact reporting.",
            icon: Eye,
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
        {
            title: "Accessibility",
            description: "Making sustainable waste management easy and accessible for everyone.",
            icon: Shield,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Impact",
            description: "Measurable results that create real environmental and social change.",
            icon: TrendingUp,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ]

    const mockAchievements = [
        { label: "Cities Served", value: "24+", icon: MapPin },
        { label: "Waste Diverted", value: "2.5M kg", icon: Recycle },
        { label: "Active Users", value: "50K+", icon: Users },
        { label: "Community Rating", value: "4.9/5", icon: Award },
    ]

    const mockContactInfo = {
        email: "contact@Eco-Collect.local",
        phone: "+1 (555) 123-4567",
        address: "123 Green Street, Eco City, EC 12345",
        website: "www.Eco-Collect.local",
    }

    const mockTimeline = [
        {
            year: "2020",
            title: "Foundation",
            description:
                "Eco-Collect was founded with a vision to revolutionize urban waste management through technology.",
        },
        {
            year: "2021",
            title: "First Pilot",
            description:
                "Launched our first pilot program in three cities, serving over 5,000 citizens.",
        },
        {
            year: "2022",
            title: "AI Integration",
            description:
                "Integrated AI-powered waste classification, making sorting easier and more accurate.",
        },
        {
            year: "2023",
            title: "National Expansion",
            description:
                "Expanded to 24 cities nationwide, reaching 50,000+ active users.",
        },
        {
            year: "2024",
            title: "Future Vision",
            description:
                "Continuing to innovate and expand, with plans to reach 100 cities by 2025.",
        },
    ]

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 }
    }

    const staggerContainer = {
        initial: { opacity: 0 },
        whileInView: { 
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        },
        viewport: { once: true }
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-background py-12 sm:py-16 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mx-auto max-w-3xl text-center"
                        {...fadeIn}
                    >
                        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                            <Heart className="mr-1.5 h-3 w-3" />
                            About Eco-Collect
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Building a{" "}
                            <span className="text-primary">Sustainable Future</span> Together
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            We're a community-driven platform that makes waste management intelligent,
                            accessible, and rewarding. Our mission is to empower every citizen to
                            contribute to a cleaner, greener planet.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-border bg-muted/30 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="grid grid-cols-2 gap-8 md:grid-cols-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                    >
                        {mockAchievements.map((achievement) => {
                            const Icon = achievement.icon
                            return (
                                <motion.div 
                                    key={achievement.label} 
                                    className="text-center"
                                    variants={fadeIn}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="mb-2 flex justify-center">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-primary">
                                        {achievement.value}
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-muted-foreground">
                                        {achievement.label}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="grid gap-12 lg:grid-cols-2"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={fadeIn}>
                            <Card className="border-0 shadow-md h-full">
                                <CardHeader>
                                    <div className="mb-4 w-fit rounded-lg bg-primary/10 p-3">
                                        <Target className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">{mockMission.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {mockMission.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeIn}>
                            <Card className="border-0 shadow-md h-full">
                                <CardHeader>
                                    <div className="mb-4 w-fit rounded-lg bg-primary/10 p-3">
                                        <Eye className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">{mockVision.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {mockVision.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-muted/50 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mx-auto max-w-2xl text-center"
                        {...fadeIn}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Our Core Values
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            These principles guide everything we do and shape how we serve our
                            community.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                    >
                        {mockValues.map((value) => {
                            const Icon = value.icon
                            return (
                                <motion.div 
                                    key={value.title} 
                                    variants={fadeIn}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card className="border-0 shadow-md h-full transition-all hover:shadow-lg">
                                        <CardHeader>
                                            <div
                                                className={`mb-4 w-fit rounded-lg p-3 ${value.bgColor}`}
                                            >
                                                <Icon className={`h-6 w-6 ${value.color}`} />
                                            </div>
                                            <CardTitle>{value.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription>{value.description}</CardDescription>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mx-auto max-w-2xl text-center"
                        {...fadeIn}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Our Journey
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            From a small startup to a nationwide platform, here's how we've grown.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-12 space-y-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="whileInView"
                        viewport={{ once: true }}
                    >
                        {mockTimeline.map((item, index) => (
                            <motion.div key={index} className="relative flex gap-6" variants={fadeIn}>
                                {/* Timeline line */}
                                {index < mockTimeline.length - 1 && (
                                    <div className="absolute left-6 top-12 h-full w-0.5 bg-border" />
                                )}
                                {/* Year badge */}
                                <div className="relative z-10 shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                        {item.year.slice(-2)}
                                    </div>
                                </div>
                                {/* Content */}
                                <Card className="flex-1 border-0 shadow-md">
                                    <CardHeader>
                                        <CardTitle className="text-xl">{item.title}</CardTitle>
                                        <CardDescription className="text-sm text-muted-foreground">
                                            {item.year}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mx-auto max-w-3xl text-center"
                        {...fadeIn}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Get in Touch
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Have questions or want to collaborate? We'd love to hear from you.
                        </p>
                    </motion.div>
                    <motion.div 
                        className="mt-12"
                        {...fadeIn}
                    >
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-8">
                                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Mail className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">Email</h3>
                                        <a
                                            href={`mailto:${mockContactInfo.email}`}
                                            className="text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {mockContactInfo.email}
                                        </a>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Phone className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">Phone</h3>
                                        <a
                                            href={`tel:${mockContactInfo.phone}`}
                                            className="text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {mockContactInfo.phone}
                                        </a>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">Address</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {mockContactInfo.address}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center text-center">
                                        <div className="mb-4 rounded-full bg-primary/10 p-3">
                                            <Globe className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="mb-2 font-semibold text-foreground">Website</h3>
                                        <a
                                            href={`https://${mockContactInfo.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-muted-foreground hover:text-primary"
                                        >
                                            {mockContactInfo.website}
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-center">
                                    <Button size="lg" asChild>
                                        <Link to="/citizen">Join Our Community</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default About
