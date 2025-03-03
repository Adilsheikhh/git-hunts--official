"use client";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch GitHub user activity
  const fetchGitHubData = async () => {
    if (!username) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (!res.ok) {
        throw new Error("User not found!");
      }
      const data = await res.json();
      setUserData(data);
    } catch (err: any) {
      setError(err.message);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchGitHubData();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">GitHunts - Track GitHub Activity</h1>
      
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
        />
        <button
          onClick={fetchGitHubData}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {userData && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg w-full max-w-md">
          <img src={userData.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full mx-auto" />
          <h2 className="text-2xl text-center font-bold mt-2">{userData.login}</h2>
          <p className="text-center mt-1">{userData.bio || "No bio available"}</p>
          <p className="text-center mt-1">Followers: {userData.followers} | Following: {userData.following}</p>
          <p className="text-center mt-1">Public Repos: {userData.public_repos}</p>
          <a
            href={userData.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-4 text-blue-400 underline"
          >
            View GitHub Profile
          </a>
        </div>
      )}
    </div>
  );
}
