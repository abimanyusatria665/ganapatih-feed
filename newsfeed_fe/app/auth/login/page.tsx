"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GuestPage from "@/components/GuestPage";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorAuth = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const msg = await res.json();
        setError(msg.message || "Login gagal");
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.accessToken);

      window.dispatchEvent(new CustomEvent("authChange")); // update navbar
      router.push("/timeline");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server");
    }
  };

  return (
    <GuestPage>
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">
            Login
          </h1>

          {errorAuth === "unauthorized" && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-center">
              Anda harus login terlebih dahulu untuk melihat timeline.
            </div>
          )}

          {error && (
            <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border rounded px-3 text-gray-900 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring focus:ring-blue-200"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-700 text-center">
              Belum punya akun?{" "}
              <a
                href="/auth/register"
                className="text-blue-600 hover:underline"
              >
                Daftar di sini
              </a>
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </GuestPage>
  );
}
