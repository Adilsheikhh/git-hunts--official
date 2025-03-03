"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, signInWithGoogle, signInWithGithub, loginWithEmail } from "@/app/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await loginWithEmail(email, password);
      router.push("/dashboard"); // Redirect after successful login
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");

    try {
      provider === "google" ? await signInWithGoogle() : await signInWithGithub();
      router.push("/dashboard"); // Redirect after login
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4">Login to GitHunts</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          onClick={() => handleProviderLogin("github")}
          className="flex items-center justify-center w-full bg-gray-800 text-white px-4 py-2 rounded-md mb-2 hover:bg-gray-700 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login with GitHub"}
        </button>

        <button
          onClick={() => handleProviderLogin("google")}
          className="flex items-center justify-center w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login with Google"}
        </button>

        <div className="flex items-center my-4">
          <div className="border-b w-full"></div>
          <span className="px-2 text-gray-500 text-sm">OR</span>
          <div className="border-b w-full"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="flex flex-col">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="border p-2 rounded-md mb-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded-md mb-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login with Email"}
          </button>
        </form>
      </div>
    </div>
  );
}
