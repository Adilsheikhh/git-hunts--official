
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Not authenticated</p>;
  }

  return <p>Welcome, {user.displayName || user.email}!</p>;
};

export default Dashboard;
