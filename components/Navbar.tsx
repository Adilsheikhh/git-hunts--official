"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession(); // Get authentication session

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">
        <Link href="/">GitHunts</Link>
      </h1>
      
      {/* If user is logged in, show profile & logout button */}
      {session ? (
        <div className="flex items-center gap-4">
          <span>{session.user?.name}</span>
          <button
            onClick={() => signOut()}
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
