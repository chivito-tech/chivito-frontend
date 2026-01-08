"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Input from "@/app/components/Input";

interface LoginScreenProps {
  onLogin: (userData: any) => void;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8002/api";

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const formValid = email && password;

  const handleNavigation = (tab: string, path: string) => {
    router.push(path);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Login failed. Please check your credentials.");
        return;
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      setError("");
      onLogin(data); // Send real user info to parent
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center px-4 md:px-8 py-10">
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        <div className="hidden md:flex flex-col justify-center gap-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10">
          <h1 className="text-4xl font-bold">Welcome to Chivito</h1>
          <p className="text-white/90">
            Sign in to add services, manage bookings, and save your favorites.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>• Post your service and get discovered</li>
            <li>• Bookmark providers you like</li>
            <li>• Manage your profile in one place</li>
          </ul>
        </div>

        {/* Right panel: form */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="md:hidden text-center mb-6">
            <h1 className="text-3xl font-bold text-purple-600">
              Welcome to Chivito
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Log in to manage your services and bookmarks.
            </p>
          </div>

          <motion.form
            initial={{ y: 10, opacity: 0.9 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-full max-w-md mx-auto bg-gray-50 border border-gray-200 p-8 rounded-xl shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative mt-4">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

            <motion.button
              type="submit"
              whileHover={{ scale: formValid ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full font-semibold py-3 mt-6 rounded-lg transition-all text-center ${
                formValid
                  ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Login
            </motion.button>

            {error && (
              <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm text-center">
                {error}
              </div>
            )}

            <p className="text-sm text-center mt-6 text-gray-500">
              Don't have an account?{" "}
              <button
                onClick={() => handleNavigation("signup", "/signup")}
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
