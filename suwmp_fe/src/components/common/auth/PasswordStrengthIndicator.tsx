import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }, [password]);

  const getStrengthLabel = () => {
    if (strength === 0) return "";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!password) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              level <= strength ? getStrengthColor() : "bg-muted",
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs transition-colors",
          strength <= 2 && "text-red-500",
          strength === 3 && "text-yellow-500",
          strength >= 4 && "text-green-500",
        )}
      >
        {getStrengthLabel()}
      </p>
    </div>
  );
};

export { PasswordStrengthIndicator };
