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

  const formValid = firstName && lastName && email && password;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showToast, setShowToast] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password.trim()) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const formData = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phone,
        photo: profilePicture ? profilePicture.name : "",
      };

      const response = await fetch("http://localhost/api/createCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log("✅ Signup successful:", data);
        router.push("/profile");
      }
    } catch (error) {
      console.error("❌ Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8 py-12 relative">
      {showToast && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded shadow-md z-50 transition">
          Please fill in all required fields.
        </div>
      )}

      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Sign up
      </h1>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl space-y-6"
      >
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="profile-picture"
            className="cursor-pointer relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-gray-200 hover:opacity-90 transition border-2 border-dashed border-gray-300 flex items-center justify-center"
          >
            {profilePicture ? (
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400 text-center px-2">
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

        {/* Input Fields */}
        <div className="space-y-4 text-black">
          <Input
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName}</p>
          )}

          <Input
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName}</p>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}

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
              className="absolute right-3 top-4.5 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <Input
            label="Phone (optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Sign Up Button */}
        <motion.button
          whileHover={{ scale: formValid ? 1.05 : 1 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          disabled={!formValid}
          onClick={handleSignup}
          className={`w-full font-semibold py-2.5 mt-4 rounded-lg transition-all text-center ${
            formValid
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Create account
        </motion.button>
      </motion.div>
    </div>
  );
}
