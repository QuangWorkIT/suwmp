import { motion } from "framer-motion"
import { Spinner } from "../ui/spinner"

function PageLoading() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-screen h-screen flex justify-center items-center bg-background"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex gap-3 items-center"
            >
                <Spinner data-icon="inline-start" className="w-5 h-5" />
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="font-medium text-muted-foreground"
                >
                    Authentication...
                </motion.span>
            </motion.div>
        </motion.div>
    )
}

export default PageLoading