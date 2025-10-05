"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuestPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // kalau sudah login, redirect ke timeline
      router.replace("/timeline");
    }
  }, [router]);

  return <>{children}</>;
}
