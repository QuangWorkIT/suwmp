import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion';
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
        >
            <Card className="p-8 max-w-4xl mx-auto shadow-lg">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Review Your Report
                    </h2>
                    <p className="text-muted-foreground">
                        Please review the details before choosing an enterprise
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-4"
                    >
                        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Uploaded Photo</Label>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 shadow-inner bg-muted relative group"
                        >
                            <img
                                src={uploadedImg ? URL.createObjectURL(uploadedImg) : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80"}
                                alt="Waste report"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Info */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors"
                            >
                                <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Waste Type</p>
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedType?.color} flex items-center justify-center`}
                                    >
                                        {selectedType && <selectedType.icon className={`w-4 h-4 text-white`} />}
                                    </motion.div>
                                    <p className="font-semibold text-lg capitalize">{selectedType?.name || "Not selected"}</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.3 }}
                                className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors"
                            >
                                <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Collection Location</p>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-primary/20 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <p className="font-medium text-sm leading-tight">{address || "Not specified"}</p>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {notes && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 30 }}
                                        transition={{ delay: 0.5, duration: 0.3 }}
                                        className="p-5 rounded-2xl bg-muted/40 border border-border/50 hover:border-primary/30 transition-colors overflow-hidden"
                                    >
                                        <p className="text-sm text-muted-foreground font-bold tracking-tighter mb-2">Additional Notes</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, duration: 0.3, type: "spring", stiffness: 150 }}
                            className="p-5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-4"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
                            >
                                <Award className="w-6 h-6 text-primary" />
                            </motion.div>
                            <div>
                                <p className="text-sm font-bold text-primary">Estimated Reward</p>
                                <p className="text-xs text-muted-foreground">+50 points upon collection</p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                    className="flex justify-between mt-8"
                >
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
                </motion.div>
            </Card>
        </motion.div>
    )
}

export default ReportReview
