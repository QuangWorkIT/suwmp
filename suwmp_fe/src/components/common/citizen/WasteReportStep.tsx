import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Step {
    stepNumber: number
    label: string
}


interface WasteReportStepProps {
    step: Step,
    currentStep: Step
}

function WasteReportStep({ step, currentStep }: WasteReportStepProps) {
    const isDone = step.stepNumber < currentStep.stepNumber
    const isActive = step.stepNumber === currentStep.stepNumber

    return (
        <div className="flex flex-col gap-3 cursor-default relative">
            <div className="flex gap-2 items-center">
                <motion.div
                    initial={false}
                    animate={{
                        backgroundColor: isDone || isActive ? "hsl(var(--primary))" : "transparent",
                        borderColor: isDone || isActive ? "hsl(var(--primary))" : "hsl(var(--foreground), 0.2)",
                        color: isDone || isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                        scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2 z-10`}
                >
                    <AnimatePresence mode="wait">
                        {isDone ? (
                            <motion.div
                                key="check"
                                initial={{ scale: 0, opacity: 0, rotate: -45 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0, opacity: 0, rotate: 45 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Check size={22} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="number"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="font-medium">{step.stepNumber + 1}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {step.stepNumber < 4 && (
                    <div className="w-30 h-0.5 bg-foreground/10 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={false}
                            animate={{
                                width: isDone ? "100%" : "0%",
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="bg-primary absolute left-0 top-0 bottom-0"
                        />
                    </div>
                )}
            </div>

            <motion.p
                animate={{
                    color: isActive || isDone ? "hsl(var(--foreground))" : "hsl(var(--foreground), 0.7)",
                    fontWeight: isActive || isDone ? 500 : 400,
                }}
                className="text-sm"
            >
                {step.label}
            </motion.p>
        </div>
    )
}


export default WasteReportStep
