import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Recycle,
    Leaf,
    AlertTriangle,
    Monitor,
    Shirt,
    Pill,
    Search,
    CheckCircle2,
    XCircle,
    Box,
    Battery,
    Sprout,
} from "lucide-react"
import { cn } from "@/lib/utils"

type WasteCategory = "all" | "organic" | "recyclable" | "hazardous"

interface WasteCategoryData {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    headerColor: string
    bgColor: string
    iconBgColor: string
    category: WasteCategory
    itemCount: number
    commonItems: string[]
    dos: string[]
    donts: string[]
}

function WasteguidePage() {
    const [selectedCategory, setSelectedCategory] = useState<WasteCategory>("all")
    const [searchQuery, setSearchQuery] = useState("")

    // TODO: Replace with actual data from API/state
    const mockQuickTips = [
        {
            icon: Recycle,
            text: "Rinse containers before recycling",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: Box,
            text: "Flatten cardboard to save space",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: Battery,
            text: "Never throw batteries in regular trash",
            color: "text-green-700",
            bgColor: "bg-green-50",
        },
        {
            icon: Sprout,
            text: "Compost food scraps when possible",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
    ]

    const mockWasteCategories: WasteCategoryData[] = [
        {
            id: "organic",
            title: "Organic Waste",
            description: "Biodegradable materials from plants and animals",
            icon: Leaf,
            headerColor: "bg-green-500",
            bgColor: "bg-green-50",
            iconBgColor: "bg-green-100",
            category: "organic",
            itemCount: 7,
            commonItems: [
                "Food scraps & leftovers",
                "Fruit and vegetable peels",
                "Coffee grounds & tea bags",
                "Eggshells",
                "+2 more",
            ],
            dos: [
                "Dispose separately from other waste",
                "Compost food scraps at home if possible",
                "Use a compost bin",
            ],
            donts: [
                "Mix with plastics or chemicals",
                "Include meat or dairy in home compost",
                "Throw in regular trash",
            ],
        },
        {
            id: "recyclables",
            title: "Recyclables",
            description: "Materials that can be reprocessed and reused",
            icon: Recycle,
            headerColor: "bg-blue-500",
            bgColor: "bg-blue-50",
            iconBgColor: "bg-blue-100",
            category: "recyclable",
            itemCount: 6,
            commonItems: [
                "Paper & cardboard",
                "Plastic bottles (PET, HDPE)",
                "Glass containers",
                "Aluminum cans",
                "+2 more",
            ],
            dos: [
                "Rinse containers before recycling",
                "Flatten cardboard to save space",
                "Check local recycling guidelines",
            ],
            donts: [
                "Include food-contaminated items",
                "Put plastic bags in recycling bin",
                "Mix different plastic types",
            ],
        },
        {
            id: "hazardous",
            title: "Hazardous Waste",
            description: "Dangerous materials requiring special handling",
            icon: AlertTriangle,
            headerColor: "bg-red-500",
            bgColor: "bg-red-50",
            iconBgColor: "bg-red-100",
            category: "hazardous",
            itemCount: 6,
            commonItems: [
                "Batteries (all types)",
                "Paint & chemicals",
                "Motor oil & fuels",
                "Pesticides & aerosols",
                "+2 more",
            ],
            dos: [
                "Store in original containers",
                "Take to designated drop-off points",
                "Check for special collection events",
            ],
            donts: [
                "Pour down drains or on ground",
                "Throw in regular trash",
                "Mix with other waste",
            ],
        },
        {
            id: "ewaste",
            title: "E-Waste",
            description: "Electronic devices and components",
            icon: Monitor,
            headerColor: "bg-purple-500",
            bgColor: "bg-purple-50",
            iconBgColor: "bg-purple-100",
            category: "hazardous", // E-waste is often classified as hazardous
            itemCount: 6,
            commonItems: [
                "Computers & laptops",
                "Mobile phones & tablets",
                "TVs & monitors",
                "Printers & scanners",
                "+2 more",
            ],
            dos: [
                "Wipe personal data before disposal",
                "Look for e-waste recyclers",
                "Donate working electronics",
            ],
            donts: [
                "Throw in regular trash",
                "Break open devices",
                "Leave batteries inside",
            ],
        },
        {
            id: "textiles",
            title: "Textiles",
            description: "Clothing, fabrics, and related materials",
            icon: Shirt,
            headerColor: "bg-pink-500",
            bgColor: "bg-pink-50",
            iconBgColor: "bg-pink-100",
            category: "recyclable",
            itemCount: 6,
            commonItems: [
                "Clothing & shoes",
                "Bedding & towels",
                "Curtains & upholstery",
                "Bags & accessories",
                "+2 more",
            ],
            dos: [
                "Donate wearable items",
                "Clean before donating",
                "Repurpose old clothes",
            ],
            donts: [
                "Throw away usable clothes",
                "Donate wet or moldy items",
                "Put in recycling bin with other materials",
            ],
        },
        {
            id: "medical",
            title: "Medical Waste",
            description: "Medications and medical supplies",
            icon: Pill,
            headerColor: "bg-orange-500",
            bgColor: "bg-orange-50",
            iconBgColor: "bg-orange-100",
            category: "hazardous",
            itemCount: 6,
            commonItems: [
                "Expired medications",
                "Syringes & needles",
                "Bandages & dressings",
                "Empty medication containers",
                "+2 more",
            ],
            dos: [
                "Use pharmacy take-back programs",
                "Place sharps in designated containers for needles",
                "Consult local guidelines",
            ],
            donts: [
                "Flush medications down toilet",
                "Throw sharps in regular trash",
                "Share unused medications",
            ],
        },
    ]

    const filterButtons: { label: string; value: WasteCategory }[] = [
        { label: "All", value: "all" },
        { label: "Organic", value: "organic" },
        { label: "Recyclable", value: "recyclable" },
        { label: "Hazardous", value: "hazardous" },
    ]

    const filteredCategories =
        selectedCategory === "all"
            ? mockWasteCategories
            : mockWasteCategories.filter((cat) => cat.category === selectedCategory)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-background py-12 sm:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mx-auto max-w-3xl text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                            <Leaf className="mr-1.5 h-3 w-3" />
                            Comprehensive Waste Guide
                        </Badge>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Learn to Sort Your{" "}
                            <span className="text-primary">Waste</span> Correctly
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                            Proper waste sorting is the first step towards a sustainable future. Use
                            this guide to learn how to dispose of different materials responsibly.
                        </p>
                        {/* Search Bar */}
                        <div className="relative mt-8 max-w-2xl mx-auto">
                            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search for an item (e.g., plastic bottle, batteries...)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Quick Tips Section */}
            <section className="bg-muted/30 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {mockQuickTips.map((tip, index) => {
                            const Icon = tip.icon
                            return (
                                <motion.div 
                                    key={index} 
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card className="border-0 shadow-sm h-full">
                                        <CardContent className="flex items-center gap-3 p-4">
                                            <div className={`rounded-lg p-2 ${tip.bgColor}`}>
                                                <Icon className={`h-5 w-5 ${tip.color}`} />
                                            </div>
                                            <span className="text-sm font-medium text-foreground">
                                                {tip.text}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Waste Categories Section */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header with Filters */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">
                            Waste Categories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {filterButtons.map((button) => (
                                <Button
                                    key={button.value}
                                    variant={selectedCategory === button.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(button.value)}
                                    className="transition-all duration-200"
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Category Cards Grid */}
                    <motion.div 
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredCategories.map((category) => {
                                const Icon = category.icon
                                return (
                                    <motion.div
                                        key={category.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <motion.div
                                            whileHover={{ y: -5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className="h-full"
                                        >
                                            <Card
                                                className="overflow-hidden rounded-3xl border border-border shadow-sm transition-shadow hover:shadow-md bg-white p-0 h-full"
                                            >
                                                {/* Top Section: Colored Background */}
                                                <div className={cn("p-6", category.bgColor)}>
                                                    {/* Top row */}
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-start gap-4">
                                                            <div
                                                                className={cn(
                                                                    "rounded-2xl p-4 shadow-sm ring-1 ring-border/50",
                                                                    category.iconBgColor
                                                                )}
                                                            >
                                                                <Icon className={cn("h-7 w-7", category.headerColor.replace("bg-", "text-"))} />
                                                            </div>
                                                            <div className="pt-1">
                                                                <CardTitle className="text-2xl">{category.title}</CardTitle>
                                                                <CardDescription className="mt-1 text-base text-foreground/70">
                                                                    {category.description}
                                                                </CardDescription>
                                                            </div>
                                                        </div>

                                                        <Badge className="rounded-full bg-white px-3 py-1 text-primary hover:bg-white border border-border/50 shadow-sm">
                                                            {category.itemCount} items
                                                        </Badge>
                                                    </div>

                                                    {/* Common items: White container */}
                                                    <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm border border-border/50">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/10 ring-1 ring-border/50">
                                                                <span className={cn("text-sm font-semibold", category.headerColor.replace("bg-", "text-"))}>i</span>
                                                            </div>
                                                            <div className="text-sm font-semibold text-foreground">
                                                                Common Items
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {category.commonItems.map((item, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="rounded-full border border-border/50 bg-white px-3 py-1 text-xs text-foreground shadow-sm"
                                                                >
                                                                    {item}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Half: White Background */}
                                                <div className="p-6 bg-white">
                                                    {/* Dos / Donts */}
                                                    <div className="grid gap-6 sm:grid-cols-2">
                                                        <div>
                                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700">
                                                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                                Do’s
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {category.dos.map((item, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-green-200" />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {item}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>

                                                        <div className="sm:border-l sm:border-border sm:pl-6">
                                                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-700">
                                                                <XCircle className="h-4 w-4 text-red-600" />
                                                                Don’ts
                                                            </div>
                                                            <ul className="space-y-2">
                                                                {category.donts.map((item, index) => (
                                                                    <li key={index} className="flex items-start gap-2">
                                                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-200" />
                                                                        <span className="text-sm text-muted-foreground">
                                                                            {item}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default WasteguidePage
