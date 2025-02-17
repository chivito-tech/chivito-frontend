import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  isLoading = false,
}: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded font-semibold transition duration-300";
  const styles = {
    primary: "bg-purple-600 text-white hover:bg-purple-500",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    outline: "border border-purple-600 text-purple-600 hover:bg-purple-100",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyle} ${styles[variant]} flex items-center justify-center`}
    >
      {isLoading ? (
        <span className="animate-spin h-5 w-5 border-2 border-t-white border-purple-500 rounded-full"></span>
      ) : (
        children
      )}
    </motion.button>
  );
}
