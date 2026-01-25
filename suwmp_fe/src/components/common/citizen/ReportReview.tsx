import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Award, MapPin } from 'lucide-react'
import type { WasteType } from './WasteClassification'
import { reverseGeocode } from '@/utilities/geocoding'
import { useEffect, useState } from 'react'

interface WasteClassificationProps {
    handleNextStep: () => void,
    handlePreviousStep: () => void,
    location: number[],
    notes: string,
    selectedType: WasteType | null,
    uploadedImg: File | null
}

function ReportReview({ handleNextStep, handlePreviousStep, location, notes, selectedType, uploadedImg }: WasteClassificationProps) {
    const [address, setAddress] = useState<string>("N/");

    useEffect(() => {
        const getAddress = async () => {
            setAddress(await reverseGeocode(location[0], location[1]))
        }
        getAddress()
        console.log("type selected:", selectedType);
    }, [])

    return (
        <Card className="p-8 animate-fade-up max-w-4xl mx-auto shadow-lg">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Review Your Report
                </h2>
                <p className="text-muted-foreground">
                    Please review the details before choosing an enterprise
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left Column: Image */}
                <div className="space-y-4">
                    <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uploaded Photo</Label>
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-inner bg-muted relative group">
                        <img
                            src={uploadedImg ? URL.createObjectURL(uploadedImg) : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"}
                            alt="Waste report"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                    </div>
                </div>

                {/* Right Column: Info */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors">
                            <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Waste Type</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedType?.color} flex items-center justify-center`}>
                                    {selectedType && <selectedType.icon className={`w-4 h-4 text-white`} />}
                                </div>
                                <p className="font-semibold text-lg capitalize">{selectedType?.name || "Not selected"}</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors">
                            <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Collection Location</p>
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-primary/20 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <p className="font-medium text-sm leading-tight">{address || "Not specified"}</p>
                            </div>
                        </div>

                        {notes && (
                            <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors">
                                <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Additional Notes</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
                            </div>
                        )}
                    </div>

                    <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-primary">Estimated Reward</p>
                            <p className="text-xs text-muted-foreground">+50 points upon collection</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-8">
                <Button variant="outline"
                    className='rounded-lg w-25'
                    onClick={handlePreviousStep} data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    className='rounded-lg w-35'
                    onClick={handleNextStep}
                    disabled={location.length === 0} data-testid="button-next">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

export default ReportReview
