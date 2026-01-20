import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    const res = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
      }),
    });

    const data = await res.json().catch(() => null);

    if (res.ok) {
      alert("Account created!");
    } else {
      alert(data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join EcoCollect and start making a difference
        </p>

        <div className="space-y-1">
          <Label htmlFor="fullName" className="text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            Full Name
          </Label>
          <Input
            name="fullName"
            placeholder="Full Name"
            required
            className="w-full border p-4 shadow-lg shadow-gray-400 input"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1 mt-6">
          <Label htmlFor="email" className="text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            Email Address
          </Label>
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            className="w-full border p-4 shadow-lg shadow-gray-400 input"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1 mt-6">
          <Label htmlFor="phoneNumber" className="text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            Phone Number
          </Label>
          <Input
            name="phoneNumber"
            type="text"
            placeholder="Phone number"
            className="w-full border p-4 shadow-lg shadow-gray-400 input"
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1 mt-6">
          <Label htmlFor="password" className="text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            Password
          </Label>
          <Input
            name="password"
            type="password"
            placeholder="Create a strong password"
            className="w-full border p-4 shadow-lg shadow-gray-400 input"
            onChange={handleChange}
          />

          <Button
            onClick={submit}
            className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-lg text-md font-semibold hover:bg-emerald-700 cursor-pointer transition"
          >
            Create Account →
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
