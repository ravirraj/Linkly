import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getCurrentUser } from "@/api/getUser";
import { useQuery } from "@tanstack/react-query";

export default function Navbar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

   const { data, isLoading, isError } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          
          {/* Left: Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-indigo-400">Shortify</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-6">
            {/* <a href="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </a>
            <a href="/shorten" className="text-gray-300 hover:text-white">
              Shorten URL
            </a> */}
            <Button
              variant="destructive"
              size="sm"
              onClick={onLogout}
              className="ml-2"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden px-4 pb-3 space-y-2 bg-gray-800 border-t border-gray-700">
          {/* Profile Card */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gray-700"></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{isError ? "Error getting the detial" : data.data.user.username}</p>
              <p className="text-xs text-gray-400">{isError ? "Error getting email" : data.data.user.email}</p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
