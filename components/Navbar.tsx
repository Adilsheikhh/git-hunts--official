
"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { signOut as signOutNextAuth } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const { user, session } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Sign out from Firebase if user exists
      if (user) {
        await signOut(auth);
      }
      // Sign out from NextAuth if session exists
      if (session) {
        await signOutNextAuth();
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName = user?.displayName || session?.user?.name || user?.email || session?.user?.email || "User";

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/">GitHunts</Link>
      </h1>
      
      {/* If user is logged in, show profile & logout button */}
      {(user || session) ? (
        <div className="flex items-center gap-4">
          <span>{displayName}</span>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${isLoggingOut ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'} px-4 py-2 rounded-md`}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      ) : (
        // If user is NOT logged in, show login button
        <Link
          href="/login"
          className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
