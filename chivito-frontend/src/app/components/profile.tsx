"use client";
import {
  LogOut,
  Shield,
  User,
  Lock,
  LifeBuoy,
  Pencil,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface ProfileScreenProps {
  user: User;
  onLogout?: () => void;
}

export default function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<string>("/user-avatar.jpg");

  useEffect(() => {
    const storedPhoto = localStorage.getItem("profile-photo");
    if (storedPhoto) {
      setProfilePhoto(storedPhoto);
      return;
    }
    if (user.photo) {
      setProfilePhoto(user.photo);
    }
  }, [user.photo]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    if (onLogout) onLogout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-8">
      <div className="text-3xl font-bold text-purple-600 mb-6 mt-6 text-center">
        <h2 className="text-2xl font-bold text-purple-600">Profile</h2>
      </div>

      <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="relative">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
          />
          <label className="absolute bottom-1 right-1 bg-purple-500 p-2 rounded-full shadow-lg cursor-pointer">
            <Pencil className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    setProfilePhoto(reader.result);
                    localStorage.setItem("profile-photo", reader.result);
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Tap the pencil to upload a new profile photo.
        </p>
        <h3 className="text-xl font-semibold mt-3">{user.name}</h3>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="w-full max-w-md bg-white mt-6 p-4 rounded-lg shadow-md">
        <ul className="space-y-4 text-gray-700">
          <SettingItem
            icon={<User className="w-5 h-5" />}
            title="Profile Info"
            onClick={() => router.push("/settings/profile")}
          />
          <SettingItem
            icon={<Briefcase className="w-5 h-5" />}
            title="My Services"
            onClick={() => router.push("/my-services")}
          />
          <SettingItem
            icon={<Lock className="w-5 h-5" />}
            title="Security"
            onClick={() => router.push("/settings/security")}
          />
          <SettingItem
            icon={<Shield className="w-5 h-5" />}
            title="Privacy"
            onClick={() => router.push("/settings/privacy")}
          />
          <SettingItem
            icon={<LifeBuoy className="w-5 h-5" />}
            title="Support"
            onClick={() => router.push("/support")}
          />
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 transition"
      >
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
  onClick?: () => void;
}

function SettingItem({
  icon,
  title,
  rightText = "",
  toggle = false,
  onClick,
}: SettingItemProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-base">{title}</span>
      </div>
      {toggle ? (
        <input type="checkbox" className="cursor-pointer" />
      ) : (
        <span className="text-sm text-gray-500">{rightText}</span>
      )}
    </>
  );

  return (
    <li className="border-b last:border-none">
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="w-full flex justify-between items-center py-3 text-left"
        >
          {content}
        </button>
      ) : (
        <div className="flex justify-between items-center py-3">{content}</div>
      )}
    </li>
  );
}
