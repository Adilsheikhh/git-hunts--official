
"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/">GitHunts</Link>
      </h1>
      
      {/* If user is logged in, show profile & logout button */}
      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.displayName || user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
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
