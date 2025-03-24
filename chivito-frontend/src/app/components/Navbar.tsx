"use client";
import { useState } from "react";
import { Bell, Bookmark, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal";
import Login from "../auth/login/login";
import Button from "./Button";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const handleNavigation = (tab, path) => {
    setActiveTab(tab);
    router.push(path);
  };

  return (
    <div className="relative bg-gray-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="container mx-auto flex justify-between items-center py-3 px-6 lg:px-10">
          {/* Left: Branding */}
          <div>
            <p className="text-xs text-gray-500">Welcome to Chivito 👋</p>
            <p className="text-sm font-semibold text-gray-800">User</p>
          </div>

          {/* Center: Search Input */}
          <div className="hidden md:block w-1/2">
            <input
              type="text"
              placeholder="Search"
              className="border text-black border-gray-300 px-4 py-2 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>

          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu className="w-8 h-8 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Input */}
      <div className="md:hidden px-6 py-3">
        <input
          type="text"
          placeholder="Search"
          className="border text-black border-gray-300 px-4 py-2 w-full rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>

      {/* Mobile Menu (if needed later) */}
      {isOpen && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="absolute top-16 left-50 right-20 bg-white shadow-md rounded-md p-5 flex flex-col space-y-4"
        >
          <Button
            onClick={() => handleNavigation("profile", "/profile")}
            variant="outline"
          >
            Login
          </Button>
          <Button variant="outline">Bookmark</Button>
        </motion.div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
          <Login onLogin={undefined} />
        </Modal>
      )}
    </div>
  );
}
