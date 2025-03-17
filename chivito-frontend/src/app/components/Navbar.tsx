"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Bookmark, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State for login modal

  return (
    <div className="bg-gray-50">
      <nav className="sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-3 px-5 md:px-1 lg:px-2">
          <div>
            <p className="text-xs text-gray-500">Welcome to Chivito 👋</p>
            <p className="text-sm font-semibold">User</p>
          </div>
          <div className="flex space-x-4">
            <button>
              <Bell className="text-gray-700 w-6 h-6" />
            </button>
            <button>
              <Bookmark className="text-gray-700 w-6 h-6" />
            </button>
          </div>

          {/* TODO:THIS BUTTON SHOULD GO INSIDE PROFILE PAGE */}
          {/* <ul className="hidden md:flex space-x-6">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-purple-600 text-white px-5 py-2 h-10 flex items-center rounded-lg hover:bg-purple-500 transition-all font-medium shadow-md"
          >
            Login
          </button>
        </ul> */}

          {/* TODO: this logic too. dont remove it, it can be useful later */}
          {/* Mobile Menu Button
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className="w-8 h-8 text-gray-700" />
          ) : (
            <Menu className="w-8 h-8 text-gray-700" />
          )}
        </button> */}
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full flex flex-col items-center py-4 space-y-4"
          >
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <button
              onClick={() => {
                setShowLogin(true);
                setIsOpen(false);
              }}
              className="bg-purple-600 text-white px-5 py-2 h-10 flex items-center rounded-lg hover:bg-purple-500 transition-all font-medium shadow-md"
            >
              Login
            </button>
          </motion.div>
        )}

        {/* Login Modal
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login />
      </Modal> */}
      </nav>
      <div className="flex justify-around py-4 px-2 md:px-20">
        <input
          type="text"
          placeholder="Search HERE"
          className="border p-4 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
        />
      </div>
    </div>
  );
}
