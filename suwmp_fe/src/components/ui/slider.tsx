import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({ value, min = 0, max = 100, onChange, className }: SliderProps) {
  const x = useMotionValue(0);
  
  useEffect(() => {
    x.set(((value - min) / (max - min)) * 100);
  }, [value, min, max, x]);

  return (
    <div className={cn("relative h-6 w-full flex items-center group touch-none", className)}>
      {/* Track */}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: useTransform(x, (v) => `${v}%`) }}
          />
      </div>

      <div className="absolute inset-0 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
          
          {/* Visual Thumb */}
          <motion.div
            className="absolute h-5 w-5 rounded-full bg-background border-2 border-primary shadow-sm pointer-events-none"
            style={{ 
                left: useTransform(x, (v) => `calc(${v}% - 10px)`),
            }}
          />
      </div>
    </div>
  );
}
