"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Input from "@/app/components/Input";

export default function Signup() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSignup = () => {
    // Simulate API call
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8 py-12">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Sign up
      </h1>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="">
          <div className="flex flex-col items-center">
            <label
              htmlFor="profile-picture"
              className="cursor-pointer relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-200 hover:opacity-90 transition"
            >
              {profilePicture ? (
                <img
                  src={URL.createObjectURL(profilePicture)}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400 flex items-center justify-center h-full">
                  Upload photo
                </span>
              )}
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <div className="space-y-4 text-black">
            <Input
              label="First name"
              // value={firstName}
              // onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              label="Last name"
              // value={lastName}
              // onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Input
              label="Phone (optional)"
              type="tel"
              // value={phone}
              // onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            // className="bg-purple-500 text-white py-2 px-4 rounded-sm"
            type="button"
            onClick={handleSignup}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 mt-8 rounded-lg transition-all"
          >
            Sign up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
