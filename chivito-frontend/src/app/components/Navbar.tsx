"use client";
import { useState } from "react";
import { Bell, Bookmark, Menu, Search, User, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal";
import Login from "../auth/login/login";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
    setIsOpen(false); // close mobile menu
  };

  return (
    <header className=" top-0 z-50 bg-white shadow-sm border-b">
      <div className="mx-auto max-w-8xl flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Left: Brand */}
        <div className="flex flex-col leading-tight">
          <span className="text-sm text-gray-400">Welcome to Chivito 👋</span>
          <span className="font-semibold text-gray-800">User</span>
        </div>

        {/* Center: Search (Desktop) */}
        <div className="hidden md:flex w-1/2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Desktop buttons */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleNavigation("profile", "/profile")}
            >
              <User className="w-4 h-4 mr-1" />
              Profile
            </Button>
            <Button variant="outline">
              <Bookmark className="w-4 h-4 mr-1" />
              Bookmarks
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className=" text-black md:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="md:hidden px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="md:hidden px-4 pb-4 space-y-2"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation("profile", "/profile")}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all"
          >
            Profile
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all"
          >
            Bookmarks
          </motion.button>
        </motion.div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
          <Login onLogin={undefined} />
        </Modal>
      )}
    </header>
  );
}
