"use client";
import {
  LogOut,
  Bell,
  CreditCard,
  Shield,
  Globe,
  Moon,
  Pencil,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface ProfileScreenProps {
  user: User;
}

export default function ProfileScreen({ user }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8">
      <div className="text-3xl font-bold text-purple-600 mb-6 mt-6 text-center">
        <h2 className="text-2xl font-bold text-purple-600">Profile</h2>
      </div>

      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="relative">
          <img
            src="/user-avatar.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-purple-500"
          />
          <button className="absolute bottom-1 right-1 bg-purple-500 p-2 rounded-full shadow-lg">
            <Pencil className="w-5 h-5 text-white" />
          </button>
        </div>
        <h3 className="text-xl font-semibold mt-3">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="w-full max-w-md bg-white mt-6 p-4 rounded-lg shadow-md">
        <ul className="space-y-4 text-gray-700">
          <SettingItem
            icon={<Bell className="w-5 h-5" />}
            title="Notifications"
          />
          <SettingItem
            icon={<CreditCard className="w-5 h-5" />}
            title="Payment"
          />
          <SettingItem icon={<Shield className="w-5 h-5" />} title="Security" />
          <SettingItem
            icon={<Globe className="w-5 h-5" />}
            title="Language"
            rightText="English (US)"
          />
          <SettingItem
            icon={<Moon className="w-5 h-5" />}
            title="Dark Mode"
            toggle={true}
          />
        </ul>
      </div>

      <button className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 transition">
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  rightText?: string;
  toggle?: boolean;
}

function SettingItem({
  icon,
  title,
  rightText = "",
  toggle = false,
}: SettingItemProps) {
  return (
    <li className="flex justify-between items-center py-3 border-b last:border-none">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-base">{title}</span>
      </div>
      {toggle ? (
        <input type="checkbox" className="cursor-pointer" />
      ) : (
        <span className="text-sm text-gray-500">{rightText}</span>
      )}
    </li>
  );
}
