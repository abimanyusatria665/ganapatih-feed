"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PostCard from "../../components/PostCard";
import ProtectedPage from "@/components/ProtectedPage";

export default function TimelinePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadPosts = async (pageNum = 1, token: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:3001/post/timeline?page=${pageNum}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setError("Gagal memuat timeline");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setPosts(data.items);
        } else {
          setPosts((prev) => [...prev, ...data.items]);
        }
      }
    } catch (err) {
      setError("Terjadi error saat fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadPosts(page, token);
    }
  }, [page]);

  return (
    <ProtectedPage>
      <div className="max-w-2xl mx-auto py-6 my-auto">
        <h1 className="text-2xl text-center text-gray-900 font-bold mb-4">
          Timeline
        </h1>

        {posts.map((post, idx) => {
          if (idx === posts.length - 1) {
            // 👇 attach observer di postingan terakhir
            return (
              <div ref={lastPostRef} key={post.id}>
                <PostCard post={post} />
              </div>
            );
          } else {
            return <PostCard key={post.id} post={post} />;
          }
        })}

        {loading && <p className="text-center">Loading...</p>}
        {!hasMore && (
          <p className="text-center text-gray-500 mt-4">
            Tidak ada lagi postingan.
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </ProtectedPage>
  );
}
