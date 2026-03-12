import type { Post } from "./types";

type PostCardProps = Omit<Post, "id" | "userId">;

export default function PostCard({
  title,
  body,
  tags,
  reactions,
  views,
}: PostCardProps) {
  return (
    <div className="w-1/2 mx-auto border border-gray-300 p-4 rounded-lg bg-gray-100 hover:shadow-md transition">
      <h4 className="text-lg font-semibold">{title}</h4>

      <p className="mt-2 text-gray-700">{body}</p>

      <div className="mt-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-block mr-2 px-2 py-0.5 bg-gray-200 rounded text-xs text-blue-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-3 text-gray-600 text-sm">
        👍 {reactions.likes} | 👎 {reactions.dislikes} | 👁️ {views} views
      </div>
    </div>
  );
}