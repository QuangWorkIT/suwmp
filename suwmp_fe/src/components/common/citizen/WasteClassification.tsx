import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Leaf, Monitor, Package, Recycle, Sparkles } from 'lucide-react';

export interface WasteType { 
    id: string,
    name: string,
    icon: React.ComponentType<any>,
    color: string
}

interface WasteClassificationProps {
    handleNextStep: () => void,
    handlePreviousStep: () => void,
    selectedType: WasteType | null,
    setSelectedType: (type: WasteType | null) => void,
}

function WasteClassification({ selectedType, setSelectedType, handleNextStep, handlePreviousStep }: WasteClassificationProps) {
    const aiSuggestion = "recyclable";

    const wasteTypes = [
        { id: "1", name: "Organic", icon: Leaf, color: "from-green-500 to-emerald-600" },
        { id: "2", name: "Recyclable", icon: Recycle, color: "from-blue-500 to-cyan-600" },
        { id: "3", name: "E-Waste", icon: Monitor, color: "from-violet-500 to-purple-600" },
        { id: "4", name: "Hazardous", icon: AlertTriangle, color: "from-red-500 to-rose-600" },
        { id: "5", name: "General", icon: Package, color: "from-gray-500 to-slate-600" },
    ];

    return (
        <Card className='p-8 w-full shadow-lg max-w-3xl mx-auto'>
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI-Powered Classification</span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Waste Classification
                </h2>
                <p className="text-muted-foreground">
                    Our AI has analyzed your image. Please confirm or correct the classification.
                </p>
            </div>

            {aiSuggestion && (
                <div className="p-5 rounded-xl bg-primary/10 border border-primary/20 mb-6">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <div>
                            <p className="text-sm font-medium">AI Suggestion: <span className="text-primary capitalize">{aiSuggestion}</span></p>
                            <p className="text-xs text-muted-foreground">Confidence: 94%</p>
                        </div>
                    </div>
                </div>
            )}

            <RadioGroup value={selectedType?.id} onValueChange={e => setSelectedType(wasteTypes.find(t => t.id === e) || null)} className="grid sm:grid-cols-2 gap-4">
                {wasteTypes.map((type) => (
                    <Label
                        key={type.id}
                        htmlFor={type.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all 
                            ${selectedType?.id === type.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                        data-testid={`radio-${type.id}`}
                    >
                        <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center shadow-md`}>
                            <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-medium">{type.name}</span>
                        {selectedType?.id === type.id && (
                            <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
                    </Label>
                ))}
            </RadioGroup>

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
                    disabled={!selectedType} data-testid="button-next">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

export default WasteClassification
