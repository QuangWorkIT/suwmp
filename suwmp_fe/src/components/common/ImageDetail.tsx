import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageDetailProps {
    imgUrl: string
    file?: File
    open: boolean
    onClose: () => void
}

function ImageDetail({ imgUrl, file, open, onClose }: ImageDetailProps) {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)

    // reset transforms when opened
    useEffect(() => {
        if (open) {
            setZoom(1)
            setRotation(0)
        }
    }, [open])

    // close on Escape key
    useEffect(() => {
        if (!open) return
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [open, onClose])

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5))
    const handleRotate = () => setRotation((prev) => prev + 90)

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md m-0"
                    onClick={onClose}
                >
                    {/* Top bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {file && (
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                    <p className="text-sm font-medium text-white truncate max-w-[300px]">
                                        {file?.name}
                                    </p>
                                </div>
                                <span className="text-xs text-white/50">
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full text-white hover:bg-white/10 hover:text-white h-10 w-10 cursor-pointer"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </motion.div>

                    {/* Image — motion.div handles entrance animation, plain img handles zoom/rotate */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={imgUrl}
                            alt={file?.name || imgUrl}
                            className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl select-none"
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transition: "transform 0.3s ease",
                            }}
                            draggable={false}
                        />
                    </motion.div>

                    {/* Bottom toolbar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="absolute bottom-6 flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-white hover:bg-white/15 h-9 w-9"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>

                        <span className="text-xs text-white/70 font-medium w-12 text-center">
                            {Math.round(zoom * 100)}%
                        </span>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-white hover:bg-white/15 h-9 w-9"
                            onClick={handleZoomIn}
                            disabled={zoom >= 3}
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>

                        <div className="w-px h-5 bg-white/20 mx-1" />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg text-white hover:bg-white/15 h-9 w-9"
                            onClick={handleRotate}
                        >
                            <RotateCw className="w-4 h-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ImageDetail