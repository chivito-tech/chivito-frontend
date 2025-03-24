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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 py-12"
    >
      <h1 className="text-3xl font-bold text-purple-600 mb-8 text-center">
        Sign up
      </h1>

      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg space-y-6">
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

        {/* <div>
          <label
            htmlFor="profile-picture"
            className="block text-gray-700 text-sm font-medium mb-1"
          >
            Profile picture (optional)
          </label>
          <input
            type="file"
            id="profile-picture"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
          />
        </div> */}

        <button
          type="button"
          onClick={handleSignup}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Sign up
        </button>
      </div>
    </motion.div>
  );
}
