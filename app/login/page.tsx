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
      import("@/app/lib/errorHandler").then(({ handleFirebaseError }) => {
        setError(handleFirebaseError(error));
      });
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
      import("@/app/lib/errorHandler").then(({ handleFirebaseError }) => {
        setError(handleFirebaseError(error));
      });
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
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      console.log("GitHub sign-in error", err);
      setError("Failed to sign in with GitHub. Please try again.");
      
      // If Firebase fails, try NextAuth
      try {
        await signIn("github", { callbackUrl: "/" });
      } catch (nextAuthErr) {
        console.error("NextAuth GitHub sign-in error", nextAuthErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      console.log("Google sign-in error", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to GitHunts</h1>
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        
        <div className="space-y-4">
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {loading ? "Signing in..." : "Sign in with GitHub"}
          </button>
          
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
            </svg>
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
