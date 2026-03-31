import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type PageProps = {
  params: { username: string };
};

export default async function UserProfilePage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      avatarKey: true,
      posts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-4 px-4 py-6">
      <section className="rounded-lg bg-white p-4 shadow">
        <h1 className="text-2xl font-semibold">
          {user.displayName || user.username}
        </h1>
        <p className="text-sm text-gray-500">@{user.username}</p>
        {user.bio && <p className="mt-2 text-sm text-gray-700">{user.bio}</p>}
      </section>
      <section className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-2 text-lg font-semibold">Posts</h2>
        {user.posts.length === 0 ? (
          <p className="text-sm text-gray-500">No posts yet.</p>
        ) : (
          <ul className="space-y-3">
            {user.posts.map((post) => (
              <li key={post.id} className="border-b pb-3 last:border-b-0">
                <p className="text-sm text-gray-900">{post.content}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {post.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
