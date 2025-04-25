"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Input from "@/app/components/Input";

interface LoginScreenProps {
  onLogin: (userData: any) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const formValid = email && password;
  const [error, setError] = useState("");

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data?.error || "Login failed");
        return;
      }
  
      if (!data.token || !data.data) {
        setError("Login response missing user data or token.");
        return;
      }
  
      localStorage.setItem("token", data.token);
  
      const userForProfile = {
        id: data.data.id,
        name: `${data.data.first_name} ${data.data.last_name}`,
        email: data.data.email,
        photo: data.data.photo,
      };
  
      onLogin(userForProfile);
    } catch (err) {
      setError("Network error. Try again.");
      console.error(err);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8 py-12">
      {/* Welcome Header */}
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Welcome to Chivito
      </h1>
      {/* Login Form */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-lg"
      >
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="relative">
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
          whileHover={{ scale: formValid ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full font-semibold py-2.5 mt-4 rounded-lg transition-all text-center ${
            formValid
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleLogin}
        >
          Login
        </motion.button>
        <p className="text-sm text-center mt-4 text-gray-500">
          Don't have an account?{" "}
          <button
            onClick={() => handleNavigation("signup", "/signup")}
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </motion.div>
    </div>
  );
}
