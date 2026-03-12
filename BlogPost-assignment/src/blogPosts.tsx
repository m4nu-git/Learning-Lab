import PostCard from "./postCard";
import postData from "./postData";

export default function BlogPosts() {
  return (
    <div className="font-sans p-8 h-screen flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Blog Posts</h2>

      <div className="flex flex-col gap-4 overflow-y-auto">
        {postData.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}