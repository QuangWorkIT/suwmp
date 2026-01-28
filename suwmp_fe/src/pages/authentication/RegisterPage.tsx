import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/AuthService";
import { Lock, Mail, Phone, Recycle, User } from "lucide-react";
import { useState } from "react";

export default function Register() {
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
  const [, setServerError] = useState("");

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

      // Optional: redirect / toast
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center">
          <div className="mb-2 p-2 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-xl inline-flex">
            <Recycle className="text-white" size={36} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join EcoCollect and start making a difference
        </p>

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

          <Button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full mt-6 bg-linear-to-br from-emerald-400 to-emerald-600 text-white py-4 rounded-lg text-md font-semibold disabled:opacity-50 hover:bg-emerald-700 cursor-pointer transition"
          >
            {loading ? "Creating..." : "Create Account →"}
          </Button>
        </div>

        <p className="text-xs text-center text-gray-400 mt-4">
          By creating an account, you agree to our{" "}
          <span className="text-emerald-500">Terms of Service</span> &{" "}
          <span className="text-emerald-500">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
