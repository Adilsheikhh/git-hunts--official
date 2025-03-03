
"use client";

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>Not authenticated</p>;
  }

  return <p>Welcome, {session.user?.name}!</p>;
};

export default Dashboard;
