"use client";
import { useEffect, useState } from "react";
import { Bookmark, Menu, User, X, Plus } from "lucide-react";
import { motion } from "framer-motion";
import Modal from "@/app/components/Modal";
import Login from "../auth/login/login";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import dynamic from "next/dynamic";

const ServiceSelect = dynamic(() => import("./ServiceSelect"), {
  ssr: false,
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selected, setSelected] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    };

    syncUser();
    const handleAuthChange = () => syncUser();

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-change", handleAuthChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-change", handleAuthChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/login") {
      setShowLogin(false);
    }
  }, [pathname]);

  const requireAuth = (callback: () => void) => {
    if (currentUser) {
      callback();
    } else {
      setShowLogin(false);
      router.push("/login");
    }
  };

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
    setIsOpen(false);
  };

  const handleAddService = () => {
    requireAuth(() => {
      setActiveTab("add-service");
      router.push("/register-your-service");
      setIsOpen(false);
    });
  };

  const handleBookmarks = () => {
    requireAuth(() => {
      // Placeholder for bookmarks action; stays on current page.
    });
  };

  const Brand = () => (
    <div className="flex flex-col leading-tight">
      <span className="text-sm text-gray-400">Welcome to Chivito 👋</span>
      <span className="font-semibold text-gray-800">User</span>
    </div>
  );

  const DesktopActions = () => {
    if (!currentUser) {
      return (
        <div className="hidden md:flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowLogin(false);
              router.push("/login");
            }}
            aria-label="Log in"
          >
            <User className="w-4 h-4 mr-1" />
            Log in
          </Button>
          <Button
            variant="primary"
            onClick={handleAddService}
            aria-label="Add service"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </Button>
        </div>
      );
    }

    return (
      <div className="hidden md:flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={() => handleNavigation("profile", "/profile")}
          aria-label="Go to profile"
        >
          <User className="w-4 h-4 mr-1" />
          Profile
        </Button>

        <Button
          variant="outline"
          onClick={handleBookmarks}
          aria-label="Bookmarks"
        >
          <Bookmark className="w-4 h-4 mr-1" />
          Bookmarks
        </Button>

        <Button
          variant="primary"
          onClick={handleAddService}
          aria-label="Add service"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Service
        </Button>
      </div>
    );
  };

  const MobileMenuToggle = () => (
    <button
      className="text-black md:hidden p-2 rounded-full hover:bg-gray-100"
      onClick={() => setIsOpen(!isOpen)}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );

  return (
    <header className="top-0 z-50 bg-white shadow-sm border-b">
      <div className="mx-auto max-w-8xl flex justify-between items-center px-4 sm:px-6 py-3">
        {/* Brand */}
        <Brand />

        {/* Center: Service search (desktop) */}
        <div className="hidden md:flex w-1/2">
          <ServiceSelect onChange={(value: string[]) => setSelected(value)} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          <DesktopActions />
          <MobileMenuToggle />
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-2">
        <ServiceSelect onChange={(value: string[]) => setSelected(value)} />
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="md:hidden px-4 pb-4 space-y-2"
        >
          {!currentUser ? (
            <>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowLogin(false);
                  router.push("/login");
                }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all"
              >
                Log in
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddService}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </motion.button>
            </>
          ) : (
            <>
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
                onClick={handleBookmarks}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all"
              >
                Bookmarks
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddService}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 mt-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* Login Modal (kept as-is, but showLogin is not wired to a button here) */}
      {showLogin && pathname !== "/login" && (
        <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
          <Login
            onLogin={(userData) => {
              setCurrentUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
              window.dispatchEvent(new Event("auth-change"));
              setShowLogin(false);
            }}
          />
        </Modal>
      )}
    </header>
  );
}
