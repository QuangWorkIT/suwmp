import EnterpriseList from "@/components/common/citizen/EnterpriseList";
import LocationDetail from "@/components/common/citizen/LocationDetail";
import ReportReview from "@/components/common/citizen/ReportReview";
import WasteClassification, { type WasteType } from "@/components/common/citizen/WasteClassification";
import WastePhotoUpload from "@/components/common/citizen/WastePhotoUpload"
import WasteReportStep, { type Step } from "@/components/common/citizen/WasteReportStep"
import ReportHeader from "@/components/layout/citizen/ReportHeader"
import { useAppSelector } from "@/redux/hooks";
import s3Service from "@/services/S3Service";
import wasteReportService from "@/services/WasteReportService";
import { useState } from "react";

function WasteReportProcess() {
    const user = useAppSelector(state => state.user)
    const [currentStep, setCurrentStep] = useState(0);
    const [imageUploaded, setImageUploaded] = useState<File | null>(null);
    const [selectedType, setSelectedType] = useState<WasteType | null>(null);
    const [location, setLocation] = useState<number[]>([]); // [longitude, latitude]
    const [notes, setNotes] = useState<string>("");
    const [selectedEnterprise, setSelectedEnterprise] = useState<number | null>(null);
    const [isSubmitting, setSubmitting] = useState(false)

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

    const handleSubmit = async () => {
        if (!imageUploaded || !selectedType || location.length !== 2
            || !notes || !selectedEnterprise || !user.user) return

        try {
            setSubmitting(true)
            const photoResponse = await s3Service.uploadImage(imageUploaded)

            if (!photoResponse) return

            const payload = {
                photoUrl: photoResponse.data,
                longitude: location[0],
                latitude: location[1],
                description: notes,
                enterprisesId: selectedEnterprise,
                citizenId: user.user?.id,
                wasteTypeId: Number(selectedType.id),
                aiSuggestedTypeId: Number(selectedType.id),
                status: "PENDING"
            }
            const data = await wasteReportService.createWasteReport(payload)
            console.log("Create report data: ", data)

            setSubmitting(false)
            resetData()
        } catch (error) {
            console.log(error)
            setSubmitting(false)
        }
    }

    const resetData = () => {
        setCurrentStep(0)
        setImageUploaded(null)
        setSelectedType(null)
        setLocation([])
        setNotes("")
        setSelectedEnterprise(null)
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

                    {currentStep === 4 && (
                        isSubmitting ? (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <EnterpriseList
                                handleSubmit={handleSubmit}
                                handlePreviousStep={handlePreviousStep}
                                selectedEnterprise={selectedEnterprise}
                                setSelectedEnterprise={setSelectedEnterprise} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default WasteReportProcess
