"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to a specific path, e.g., `/tasks`
    router.push("/tasks");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
};

export default HomePage;
