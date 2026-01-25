import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, MapPin, Star, ExternalLink } from "lucide-react"

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
        <Card className="p-8 animate-fade-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Choose Enterprise
                </h2>
                <p className="text-muted-foreground">
                    Select a nearby enterprise to handle your waste collection
                </p>
            </div>

            <div className="grid gap-4 mb-8">
                {mockEnterprises.map((enterprise) => (
                    <div
                        key={enterprise.id}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer hover:border-primary/50 group ${selectedEnterprise === enterprise.id ? "border-primary bg-primary/5" : "border-border"
                            }`}
                        onClick={() => setSelectedEnterprise(enterprise.id)}
                        data-testid={`enterprise-${enterprise.id}`}
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${selectedEnterprise === enterprise.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                                }`}>
                                <Check className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
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
                    onClick={handleSubmit}
                    disabled={selectedEnterprise === null} data-testid="button-next">
                    Submit
                    <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

export default EnterpriseList