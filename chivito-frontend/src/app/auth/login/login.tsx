"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginScreen({ onLogin }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Simulate authentication (Replace with real API call)
    const mockUser = { name: "Andrew Ainsley", email };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8 py-12">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Welcome to Chivito
      </h1>

      {/* Login Form */}
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg">
        <label className="block text-gray-700 text-sm font-semibold mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-gray-700 text-sm font-semibold mb-1 mt-4">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <button
          className="w-full mt-6 bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-500 transition font-semibold shadow-md"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <button
            className="text-purple-600 font-semibold hover:underline"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
