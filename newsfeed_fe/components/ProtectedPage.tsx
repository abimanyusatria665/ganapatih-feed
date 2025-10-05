"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number; // expiry dalam UNIX timestamp
};

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login?error=unauthorized");
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        // token expired
        localStorage.removeItem("token");
        router.replace("/auth/login?error=session_expired");
        return;
      }
    } catch (err) {
      // kalau token rusak
      localStorage.removeItem("token");
      router.replace("/auth/login?error=invalid_token");
      return;
    }
  }, [router]);

  return <>{children}</>;
}
