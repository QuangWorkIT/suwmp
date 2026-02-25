import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/services/AuthService";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import { FormInput } from "./FormInput";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";

const forgotPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/\d/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordInputNewPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword", "");

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      if (!resetToken) throw new Error("Reset token is missing.");

      await AuthService.resetPassword({
        resetToken,
        newPassword: watch("newPassword"),
      });

      console.log("Password reset successfully.");

      toast.success("Your password has been successfully changed.");
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-md shadow-lg border-border/50 animate-slide-up">
      <CardHeader className="space-y-1 text-center pb-6">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Reset Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <FormInput
              id="newPassword"
              label="New Password"
              type="password"
              placeholder="Enter new password"
              icon={<KeyRound size={18} />}
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <PasswordStrengthIndicator password={newPassword} />
          </div>

          <FormInput
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            icon={<KeyRound size={18} />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { ForgotPasswordInputNewPassword };
