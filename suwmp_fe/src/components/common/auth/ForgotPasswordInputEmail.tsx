import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { FormInput } from "./FormInput";
import { AuthService } from "@/services/AuthService";

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordInputEmail = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);

      await AuthService.verifyEmail(data.email);

      console.log("Identify email successfully.");

      toast.success("Identify email successfully.");
    } catch (error) {
      toast.error("Failed to identify email.");
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
          Enter your email to create a new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormInput
            id="email"
            label="Email"
            placeholder="Enter your email"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register("email")}
            autoFocus
          />

          <Button
            type="submit"
            className="w-full h-11 font-medium transition-all duration-200 hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Send OTP"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <a
              href="#"
              className="text-primary hover:underline font-medium transition-colors"
            >
              Sign in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordInputEmail;
