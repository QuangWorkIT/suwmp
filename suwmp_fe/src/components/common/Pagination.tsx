import { Button } from '../ui/button'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number,
    totalPages: number,
    hasPrev: boolean,
    hasNext: boolean,
    fetchItems: (page: number) => void
}

function Pagination({ currentPage, totalPages, hasPrev, hasNext, fetchItems }: PaginationProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 20 }}
            className="flex gap-2 mt-6 items-center justify-center"
        >
            <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev}
                onClick={() => fetchItems(currentPage - 1)}
                className="gap-1"
            >
                <ChevronLeft className="w-4 h-4" />
                Prev
            </Button>

            <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => {
                    const isActive = currentPage === index;
                    return (
                        <motion.button
                            key={index}
                            onClick={() => fetchItems(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.92 }}
                            className="relative w-9 h-9 rounded-lg text-sm font-medium overflow-hidden
                                transition-colors cursor-pointer"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activePage"
                                    className="absolute inset-0 bg-primary rounded-lg shadow-md"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className={`relative z-10 ${isActive
                                ? "text-primary-foreground font-semibold"
                                : "text-muted-foreground hover:text-foreground"
                                }`}>
                                {index + 1}
                            </span>
                        </motion.button>
                    )
                })}
            </div>

            <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                onClick={() => fetchItems(currentPage + 1)}
                className="gap-1"
            >
                Next
                <ChevronRight className="w-4 h-4" />
            </Button>
        </motion.div>
    )
}

export default Pagination