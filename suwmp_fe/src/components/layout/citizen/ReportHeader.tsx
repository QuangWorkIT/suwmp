import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { ArrowLeft, Recycle } from 'lucide-react';

function ReportHeader() {
    return (
        <div className="fixed top-0 w-full left-0 backdrop-blur-sm backdrop-saturate-100 bg-white/50 text-black p-4 border-b border-foreground/20">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
                <Link to={"/citizen"}>
                    <Button variant={"default"} className='bg-transparent hover:bg-foreground/5 text-foreground 
                cursor-pointer rounded-lg ml-4 font-normal'>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to dashboard
                    </Button>
                </Link>

                {/* header logo */}
                <div className={`flex items-center gap-2 hover:cursor-pointer mr-5`}>
                    <div className={`rounded-2xl text-primary`}>
                        <Recycle size={20} />
                    </div>
                    <h1 className={`font-bold  font-medium`}>
                        New Waste Report
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default ReportHeader
