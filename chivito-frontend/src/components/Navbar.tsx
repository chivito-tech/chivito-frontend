"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/components/Modal";
import Login from "@/components/Login"; // Import the login form

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // State for login modal

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-8 md:px-1 lg:px-2">
        <h1 className="text-2xl font-bold text-purple-600">Chivito</h1>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/services"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Services
            </Link>
          </li>
          <li></li>
        </ul>
        <ul className="hidden md:flex space-x-6">
          <button
            onClick={() => setShowLogin(true)}
            className="bg-purple-600 text-white px-5 py-2 h-10 flex items-center rounded-lg hover:bg-purple-500 transition-all font-medium shadow-md"
          >
            Login
          </button>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <X className="w-8 h-8 text-gray-700" />
          ) : (
            <Menu className="w-8 h-8 text-gray-700" />
          )}
        </button>
      </div>

      {/* Login Modal */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login />
      </Modal>
    </nav>
  );
}
