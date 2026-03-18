import EnterpriseList from "@/components/common/citizen/EnterpriseList";
import LocationDetail from "@/components/common/citizen/LocationDetail";
import ReportReview from "@/components/common/citizen/ReportReview";
import WasteClassification from "@/components/common/citizen/WasteClassification";
import WastePhotoUpload from "@/components/common/citizen/WastePhotoUpload"
import WasteReportStep, { type Step } from "@/components/common/citizen/WasteReportStep"
import ReportHeader from "@/components/layout/citizen/ReportHeader"
import { useAppSelector } from "@/redux/hooks";
import s3Service from "@/services/waste-reports/S3Service";
import wasteReportService from "@/services/waste-reports/WasteReportService";
import type { WasteCategory } from "@/types/WasteCategory";
import { useState } from "react";
import { toast } from "sonner";
import { WasteReportStatus, type NearbyEnterpriseResponse } from "@/types/WasteReportRequest"
import { RewardTransactionService } from "@/services/rewards/RewardTransactionService";

function WasteReportProcess() {
    const user = useAppSelector(state => state.user)
    const [currentStep, setCurrentStep] = useState(0);
    const [imageUploaded, setImageUploaded] = useState<File | null>(null);
    const [volume, setVolume] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<WasteCategory | null>(null);
    const [location, setLocation] = useState<number[]>([]); // [longitude, latitude]
    const [notes, setNotes] = useState<string>("");
    const [selectedEnterprise, setSelectedEnterprise] = useState<NearbyEnterpriseResponse | null>(null);
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

    const getWasteReportPayload = (photoUrl: string) => {
        if (!selectedType || !user.user || !selectedEnterprise || !volume) return null
        return {
            photoUrl: photoUrl,
            longitude: location[0],
            latitude: location[1],
            description: notes,
            enterprisesId: selectedEnterprise.id,
            citizenId: user.user?.id,
            wasteTypeId: selectedType.id,
            aiSuggestedTypeId: selectedType.id,
            status: WasteReportStatus.PENDING,
            volume: volume
        }
    }


    const handleSubmit = async () => {
        if (!imageUploaded || !selectedType || location.length !== 2
            || !selectedEnterprise || !user.user) {
            return
        }

        try {
            setSubmitting(true)

            const photoResponse = await s3Service.uploadImage(imageUploaded)
            if (!photoResponse) {
                toast.error("Failed too upload image", { position: "top-right" })
                setSubmitting(false)
                return
            }

            const payload = getWasteReportPayload(photoResponse.data)
            if (!payload) {
                throw new Error("Missing waste report data")
            }

            const wastedReportResponse = await wasteReportService.createWasteReport(payload)
            if (!wastedReportResponse) {
                throw new Error("Fail to create waste report")
            }

            const rewardTransactionResponse = await RewardTransactionService.createRewardTransaction({
                citizenId: user.user.id,
                wasteReportId: wastedReportResponse.data,
                points: selectedEnterprise.rewardPoints,
                reason: "Waste report submission success"
            })

            if (!rewardTransactionResponse.isSuccess) {
                throw new Error(rewardTransactionResponse.message)
            }

            toast.success("Report submitted successfully", {
                position: "top-right"
            })

            resetData()
        } catch (error) {
            console.log(error)
            toast.error("Fail to submit report!", {
                position: "top-right"
            })
        } finally {
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
        <div className="min-h-screen w-full bg-background relative p-16">
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
                            volume={volume}
                            setVolume={setVolume}
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
                                <div className="animate-spin rounded-full h-28 w-28 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <EnterpriseList
                                longitude={location[0]}
                                latitude={location[1]}
                                wasteTypeId={selectedType?.id || 1}
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
