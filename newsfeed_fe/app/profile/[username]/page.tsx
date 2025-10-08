"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import ProtectedPage from "@/components/ProtectedPage";
import PostCard from "@/components/PostCard";

type JwtPayload = {
  username: string;
  exp: number;
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const username = params?.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // 🔹 untuk mencegah spam klik
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  // ✅ Fetch profile
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token || !username) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile/${username}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setError("Gagal memuat profil");
        return;
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError("Terjadi error saat memuat profil");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Ambil token + fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: JwtPayload = jwtDecode(token);
      setLoggedUser(decoded.username);
    } catch {
      console.warn("Token invalid saat decode username");
    }

    fetchProfile();
  }, [username]);

  // ✅ Handle Follow
  const handleFollow = async () => {
    if (!profile || isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow/${profile.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Gagal follow user");

      await fetchProfile(); // refresh profile setelah follow
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat follow");
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Handle Unfollow
  const handleUnfollow = async () => {
    if (!profile || isProcessing) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/unfollow/${profile.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Gagal unfollow user");

      await fetchProfile(); // refresh profile setelah unfollow
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat unfollow");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <p className="text-center py-6">Loading...</p>;
  if (error) return <p className="text-center text-red-500 py-6">{error}</p>;

  return (
    <ProtectedPage>
      <div className="max-w-2xl mx-auto py-6">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {profile.username}
            </h2>
            <p className="text-gray-600 text-sm">
              Bergabung sejak{" "}
              {new Date(profile.createdAt).toLocaleDateString("id-ID")}
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 flex justify-around text-center">
            <div>
              <p className="text-lg font-bold">{profile.followers}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div>
              <p className="text-lg font-bold">{profile.following}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div>
              <p className="text-lg font-bold">{profile.posts.length}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
          </div>

          {/* Conditional Button */}
          <div className="mt-6 text-center">
            {loggedUser === profile.username ? (
              <button
                onClick={() => router.push("/create-post")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Create Post
              </button>
            ) : profile.isFollowing ? (
              <button
                onClick={handleUnfollow}
                disabled={isProcessing}
                className={`${
                  isProcessing ? "bg-gray-400" : "bg-gray-300 hover:bg-gray-400"
                } text-gray-800 px-4 py-2 rounded`}
              >
                {isProcessing ? "Processing..." : "Unfollow"}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                disabled={isProcessing}
                className={`${
                  isProcessing ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded`}
              >
                {isProcessing ? "Processing..." : "Follow"}
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Postingan</h3>
          {profile.posts.length === 0 ? (
            <p className="text-gray-500 text-center">Belum ada postingan</p>
          ) : (
            profile.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
