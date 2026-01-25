import { Check } from 'lucide-react';

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
        <div className="flex flex-col gap-3 cursor-default">
            <div className="flex gap-2 items-center">
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
                    ${isActive ? "bg-primary text-white" : "border border-foreground/20 text-foreground"}
                    ${isDone ? "bg-primary text-white" : ""}`}
                >
                    {isDone ? <Check size={22} /> : <span className="font-medium">{step.stepNumber + 1}</span>}
                </div>

                {step.stepNumber < 4 && (
                    <div
                        className={`w-30 h-0.5 rounded-full
                    ${isDone ? "bg-primary" : "bg-foreground/10"}`}
                    />
                )}
            </div>

            <p className={`${isActive || isDone ? "font-medium" : "text-foreground/70"} text-sm`}>
                {step.label}
            </p>
        </div>
    )
}


export default WasteReportStep
