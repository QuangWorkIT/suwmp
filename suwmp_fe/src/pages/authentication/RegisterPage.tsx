import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/AuthService";
import { Lock, Mail, Phone, Recycle, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Field-level validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) return;

    try {
      setLoading(true);

      const response = await AuthService.register(form);
      console.log("Register success:", response);

      toast.success("Account created successfully!");

      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password))
      return "Password must contain at least 1 lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must contain at least 1 uppercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least 1 number";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl m-8 p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="mb-3 p-3.5 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl inline-flex">
            <Recycle className="text-white" size={36} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join EcoCollect and start making a difference
        </p>

        {/* Full Name Input */}
        <div className="space-y-1">
          <Label htmlFor="fullName" className="text-base">
            <User className="size-5" />
            Full Name
          </Label>
          <Input
            name="fullName"
            placeholder="Full Name"
            required
            className="w-full border p-4 shadow-lg shadow-gray-200 input"
            onChange={handleChange}
          />
        </div>

        {/* Email Input */}
        <div className="space-y-1 mt-6">
          <Label htmlFor="email" className="text-base">
            <Mail className="size-5" />
            Email Address
          </Label>
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            className={`w-full border p-4 shadow-lg shadow-gray-200 input ${
              errors.email ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="space-y-1 mt-6">
          <Label htmlFor="phone" className="text-base">
            <Phone className="size-5" />
            Phone Number
          </Label>
          <Input
            name="phone"
            type="text"
            placeholder="Phone number"
            className="w-full border p-4 shadow-lg shadow-gray-200 input"
            onChange={handleChange}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1 mt-6">
          <Label htmlFor="password" className="text-base">
            <Lock className="size-5" />
            Password
          </Label>
          <Input
            name="password"
            type="password"
            placeholder="Create a strong password"
            className={`w-full border p-4 shadow-lg shadow-gray-200 input ${
              errors.password ? "border-red-500" : ""
            }`}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          {serverError && (
            <p className="text-red-500 text-sm mt-3 text-center">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-linear-to-r from-teal-500 to-green-500 text-white font-semibold mt-6 py-5 px-3 rounded-xl 
            hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 
            transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal-200 cursor-pointer"
          >
            {loading ? "Creating..." : "Create Account →"}
          </Button>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full flex items-center justify-center mt-6 px-5 py-3 border border-gray-200 rounded-xl 
            hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-500">Google</span>
          </Button>
        </div>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-teal-500 hover:text-teal-600 transition-colors"
          >
            Back to Sign in page
          </Link>
        </p>

        <p className="text-xs text-center text-gray-400 mt-4">
          By creating an account, you agree to our{" "}
          <span className="text-emerald-500">Terms of Service</span> &{" "}
          <span className="text-emerald-500">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
