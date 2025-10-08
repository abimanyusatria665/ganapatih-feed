"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type JwtPayload = {
  sub: number;
  username: string;
  exp: number;
};

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        setUsername(null);
        return;
      }

      try {
        const decoded: JwtPayload = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          // token expired
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUsername(null);
          return;
        }

        setIsLoggedIn(true);
        setUsername(decoded.username);
      } catch {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    };

    checkToken();

    // ✅ listen perubahan auth
    window.addEventListener("authChange", checkToken);
    return () => window.removeEventListener("authChange", checkToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername(null);
    router.push("/auth/login");
  };

  // ✅ Search profile
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length === 0) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/search?query=${value}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return;

      const data = await res.json();
      setResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center relative">
        {/* Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Ganapatih Feed
          </Link>

          {isLoggedIn && (
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                onFocus={() => results.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Search profile..."
                className="w-64 px-3 py-1 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {showDropdown && results.length > 0 && (
                <div className="absolute top-10 left-0 w-64 bg-white border rounded-lg shadow-lg z-50">
                  {results.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      className="block px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {user.username}
                    </Link>
                  ))}
                  {results.length === 0 && (
                    <p className="px-3 py-2 text-gray-500 text-sm">
                      No results
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link href="/timeline" className="hover:text-blue-500">
                Timeline
              </Link>
              <Link
                href={`/profile/${username}`}
                className="hover:text-blue-500"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
