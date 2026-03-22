import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleX, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface ConfirmStartCollectionProps {
    open: boolean
    onClose: () => void
    onClick: () => Promise<void>
}

function ConfirmStartCollection({ open, onClose, onClick }: ConfirmStartCollectionProps) {
    const [isStarting, setIsStarting] = useState(false)

    const handleOnclick = async () => {
        setIsStarting(true)
        await onClick()
        setIsStarting(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/50 backdrop-blur-sm z-100
                    flex items-center justify-center'
                >
                    <Card className='w-[400px] relative'>
                        <div className="absolute top-5 right-5 hover:scale-110 transition-all">
                            <CircleX className='cursor-pointer' onClick={onClose} />
                        </div>
                        <CardHeader>
                            <CardTitle className='font-semibold'>Confirm Start Collection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-foreground/70'>Are you sure starting this collection?</p>
                        </CardContent>
                        <CardFooter className='flex justify-end gap-2'>
                            <Button variant="outline" onClick={onClose}>Cancel</Button>
                            <Button disabled={isStarting} className='bg-blue-500 text-white hover:bg-blue-600' onClick={handleOnclick}>
                                {
                                    isStarting ? (
                                        <>
                                            <Loader2 className='h-4 w-4 animate-spin' />
                                            Starting...
                                        </>
                                    ) : (
                                        "Start collection"
                                    )
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ConfirmStartCollection