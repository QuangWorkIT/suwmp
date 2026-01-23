import LocationDetail from "@/components/common/citizen/LocationDetail";
import ReportReview from "@/components/common/citizen/ReportReview";
import WasteClassification, { type WasteType } from "@/components/common/citizen/WasteClassification";
import WastePhotoUpload from "@/components/common/citizen/WastePhotoUpload"
import WasteReportStep, { type Step } from "@/components/common/citizen/WasteReportStep"
import ReportHeader from "@/components/layout/citizen/ReportHeader"
import { useState } from "react";

function WasteReportProcess() {
    const [imageUploaded, setImageUploaded] = useState<File | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedType, setSelectedType] = useState<WasteType | null>(null);
    const [location, setLocation] = useState<number[]>([]);
    const [notes, setNotes] = useState<string>("");

    const steps: Step[] = [
        { label: "Upload photo", stepNumber: 0 },
        { label: "Waste classification", stepNumber: 1 },
        { label: "Location", stepNumber: 2 },
        { label: "Review", stepNumber: 3 },
        { label: "Choose Enterprise", stepNumber: 4 }
    ]

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    return (
        <div className="min-h-screen w-full bg-background relative p-15">
            <ReportHeader />
            <div className="flex flex-col gap-10 items-center justify-center pt-10">

                {/* Process steps */}
                <ul className="flex gap-12 items-center">
                    {steps.map(step => (
                        <WasteReportStep
                            key={step.label}
                            step={step}
                            currentStep={steps[currentStep]}
                        />
                    ))}
                </ul>

                {/*  Data collection cards */}
                <div className="min-w-3xl">
                    {currentStep === 0 && (
                        <WastePhotoUpload
                            imageUploaded={imageUploaded}
                            setImageUploaded={setImageUploaded}
                            handleNextStep={handleNextStep}
                        />
                    )}

                    {currentStep === 1 && (
                        <WasteClassification
                            selectedType={selectedType}
                            setSelectedType={setSelectedType}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep} />
                    )}

                    {currentStep === 2 && (
                        <LocationDetail
                            location={location}
                            setLocation={setLocation}
                            notes={notes}
                            setNotes={setNotes}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep} />
                    )}

                    {currentStep === 3 && (
                        <ReportReview
                            location={location}
                            notes={notes}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep}
                            selectedType={selectedType}
                            uploadedImg={imageUploaded} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default WasteReportProcess
