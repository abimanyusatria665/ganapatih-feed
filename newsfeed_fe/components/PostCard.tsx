export default function PostCard({ post }: { post: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center mb-2">
        <p className="font-semibold text-blue-600">{post.user.username}</p>
        <span className="ml-2 text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-gray-800 break-words">{post.content}</p>
    </div>
  );
}
