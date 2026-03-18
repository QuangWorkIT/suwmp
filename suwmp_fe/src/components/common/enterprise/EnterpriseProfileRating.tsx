"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface RatingProps {
  value?: number;
  max?: number;
}

const EnterpriseProfileRating = ({ value = 0, max = 5 }: RatingProps) => {
  const getStarType = (index: number) => {
    if (value >= index) return "full";
    if (value >= index - 0.5) return "half";
    return "empty";
  };

  return (
    <div className="flex items-center gap-2">
      {/* Number */}
      <span className="text-sm font-medium text-gray-700 min-w-[50px]">
        {value.toFixed(1)} / {max}
      </span>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, i) => {
          const starIndex = i + 1;
          const type = getStarType(starIndex);

          return (
            <motion.div
              key={starIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              {type === "full" && (
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              )}

              {type === "half" && (
                <div className="relative">
                  {/* Empty star */}
                  <Star className="h-4 w-4 text-gray-300" />

                  {/* Half fill */}
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              )}

              {type === "empty" && (
                <Star className="h-4 w-4 text-gray-300" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default EnterpriseProfileRating;