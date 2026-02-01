import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, MapPin, Star, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

/* Animation config using CSS variables from index.css */
const motionDuration = 0.35
const motionEase = [0.16, 1, 0.3, 1] as const
const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: motionDuration, ease: motionEase },
}
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08,
        },
    },
}
const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
}

interface EnterpriseListProps {
    handleSubmit: () => void,
    handlePreviousStep: () => void,
    selectedEnterprise: number | null,
    setSelectedEnterprise: (enterprise: number) => void
}

function EnterpriseList({
    handleSubmit,
    handlePreviousStep,
    selectedEnterprise,
    setSelectedEnterprise
}: EnterpriseListProps) {
    const mockEnterprises = [
        {
            id: 1,
            name: "Enterprise 1",
            image: "",
            rating: 4.5,
            distance: "1.2 km",
        }
    ]

    return (
        <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={fadeUp.transition}
        >
            <Card className="p-8">
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: motionDuration, ease: motionEase, delay: 0.05 }}
                >
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Choose Enterprise
                    </h2>
                    <p className="text-muted-foreground">
                        Select a nearby enterprise to handle your waste collection
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-4 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {mockEnterprises.map((enterprise) => {
                        const isSelected = selectedEnterprise === enterprise.id
                        return (
                            <motion.div
                                key={enterprise.id}
                                variants={itemVariants}
                                transition={{ duration: motionDuration, ease: motionEase }}
                                className={`p-4 rounded-2xl border-2 cursor-pointer hover:border-primary/50 group ${isSelected ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                                onClick={() => setSelectedEnterprise(enterprise.id)}
                                data-testid={`enterprise-${enterprise.id}`}
                                initial={false}
                                animate={{
                                    borderColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--border))",
                                    backgroundColor: isSelected ? "hsl(var(--primary) / 0.05)" : "transparent",
                                    scale: 1,
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-border">
                                        <img src={enterprise?.image || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"} alt={enterprise.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-bold truncate">{enterprise.name}</h3>
                                            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                                <Star className="w-4 h-4 fill-current" />
                                                {enterprise.rating}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {enterprise.distance}</span>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        animate={{
                                            backgroundColor: isSelected ? "hsl(var(--primary))" : "hsl(var(--muted))",
                                            color: isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                                        }}
                                        transition={{ duration: 0.25, ease: motionEase }}
                                    >
                                        <Check className="w-5 h-5" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                <motion.div
                    className="flex justify-between mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: motionDuration, ease: motionEase, delay: 0.2 }}
                >
                    <Button variant="outline"
                        className='rounded-lg w-25'
                        onClick={handlePreviousStep} data-testid="button-back">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button
                        className='rounded-lg w-35'
                        onClick={handleSubmit}
                        disabled={selectedEnterprise === null} data-testid="button-next">
                        Submit
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                </motion.div>
            </Card>
        </motion.div>
    )
}

export default EnterpriseList