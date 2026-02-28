import { useState } from "react";
import { Zap, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { AuthService } from "@/services/AuthService";
import { toast } from "sonner";
import { decodePayLoad } from "@/utilities/jwt";
import { useAppDispatch } from "@/redux/hooks";
import { resolveUser } from "@/hooks/useLogin";
import { GoogleLogin } from "@react-oauth/google";
export const roleNavigation = {
  "ENTERPRISE": "/enterprise",
  "COLLECTOR": "/collector",
  "ADMIN": "/admin",
  "CITIZEN": "/citizen"
}

export default function Login() {
  const dispatch = useAppDispatch()
  const nav = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string): string => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required";
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (touched[name as keyof typeof touched]) {
      const error = name === "email" ? validateEmail(value) : validatePassword(value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
    const value = form[field];
    const error = field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors({ ...errors, [field]: error });
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    setTouched({
      email: true,
      password: true,
    });

    if (!emailError && !passwordError) {
      const res = await AuthService.login(form);

      if (res.success) {
        try {
          const token = res.data.accessToken
          
          const payload = decodePayLoad(token)
          
          localStorage.setItem("token", token)
          await resolveUser(dispatch, payload, token)
          
          toast.success("Login successfully")
          nav(roleNavigation[payload.role], { replace: true })
        } catch {
          toast.error("Login succeeded but failed to initialize session")
        }
      } else {
        if (res.error === "User not found" || res.error === "Invalid password") {
          toast.error("Invalid credentials");
        } else {
          toast.error(res.error);
        }
      }
    }
  };

  const handleGoogleLoginSuccess = async (googleTokenResponse: any) => {
    const idToken = googleTokenResponse.credential;
    if (!idToken) {
      console.error("Google did not return ID Token")
      toast.error("Google login failed");
      return;
    }
    
    await AuthService.loginByGoogle(idToken)
    .then(async (res) => {
      try {
        const token = res.data.accessToken;

        const payload = decodePayLoad(token);

        localStorage.setItem("token", token);
        await resolveUser(dispatch, payload, token);

        toast.success("Login successfully");
        nav(roleNavigation[payload.role], { replace: true })
      } catch (error) {
        console.error(error);
        throw error;
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Google login failed");
    })
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-500">Sign in to your EcoCollect account</p>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${touched.email && errors.email
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-teal-500 focus:border-transparent"
                  }`}
              />
            </div>
            {touched.email && errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link to="/forgot-password" className="text-sm text-teal-500 hover:text-teal-600 transition-colors">
                Forgot password?
              </Link >
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${touched.password && errors.password
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-200 focus:ring-teal-500 focus:border-transparent"
                  }`}
              />
            </div>
            {touched.password && errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Keep me signed in */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keepSignedIn"
              className="w-4 h-4 border-gray-300 rounded text-teal-500 focus:ring-teal-500 focus:ring-2 transition-all cursor-pointer"
            />
            <label
              htmlFor="keepSignedIn"
              className="ml-2 text-sm text-gray-600 cursor-pointer select-none"
            >
              Keep me signed in
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            onClick={submit}
            className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-teal-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal-200"
          >
            Sign In
            <span className="ml-2">→</span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Social Login Button */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error("Google Login popup failed")}
            auto_select={false}
            useOneTap={false}
            width="100%"
            shape="rectangular"
          />

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-teal-500 hover:text-teal-600 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
