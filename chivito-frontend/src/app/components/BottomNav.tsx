"use client";
import { useRouter } from "next/navigation";
import { Home, Calendar, Inbox, User, Search, Bookmark } from "lucide-react";
import { useState } from "react";

export default function BottomNav() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  const handleNavigation = (tab: string, path: string) => {
    setActiveTab(tab);
    router.push(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around items-center">
      <button
        onClick={() => handleNavigation("home", "/")}
        className="flex flex-col items-center"
      >
        <Home
          className={`w-6 h-6 ${
            activeTab === "home" ? "text-purple-500" : "text-gray-500"
          }`}
        />
        <span
          className={`text-xs ${
            activeTab === "home"
              ? "text-purple-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Home
        </span>
      </button>

      <button
        onClick={() => handleNavigation("calendar", "/calendar")}
        className="flex flex-col items-center"
      >
        <Search
          className={`w-6 h-6 ${
            activeTab === "search" ? "text-purple-500" : "text-gray-500"
          }`}
        />
        <span
          className={`text-xs ${
            activeTab === "search"
              ? "text-purple-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Search
        </span>
      </button>

      <button
        onClick={() => handleNavigation("calendar", "/calendar")}
        className="flex flex-col items-center"
      >
        <Bookmark
          className={`w-6 h-6 ${
            activeTab === "bookmark" ? "text-purple-500" : "text-gray-500"
          }`}
        />
        <span
          className={`text-xs ${
            activeTab === "bookmark"
              ? "text-purple-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Bookmark
        </span>
      </button>

      <button
        onClick={() => handleNavigation("profile", "/profile")}
        className="flex flex-col items-center"
      >
        <User
          className={`w-6 h-6 ${
            activeTab === "profile" ? "text-purple-500" : "text-gray-500"
          }`}
        />
        <span
          className={`text-xs ${
            activeTab === "profile"
              ? "text-purple-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Profile
        </span>
      </button>
    </nav>
  );
}
