"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const maxChars = 200;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim().length === 0) {
      setError("Post tidak boleh kosong");
      return;
    }

    if (content.length > maxChars) {
      setError(`Maksimal ${maxChars} karakter`);
      return;
    }

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3001/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Gagal membuat post");
        setLoading(false);
        return;
      }

      // Redirect ke halaman profile setelah sukses
      const decoded = JSON.parse(atob(token!.split(".")[1]));
      router.push(`/profile/${decoded.username}`);
    } catch {
      setError("Terjadi kesalahan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
        Create Post
      </h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={maxChars}
          rows={4}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring focus:ring-blue-200 text-gray-900"
          placeholder="Apa yang kamu pikirkan?"
        />

        {/* Character Counter */}
        <div className="text-right text-sm text-gray-500 mt-1">
          {content.length}/{maxChars}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
