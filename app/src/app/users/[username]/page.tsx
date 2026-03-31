import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getUserFeed } from "@/lib/posts";
import { FeedClient } from "@/app/components/FeedClient";

type PageProps = {
  params: { username: string };
};

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: PageProps) {
  const sessionUser = await getCurrentUser();
  const feedResult = await getUserFeed(
    params.username,
    sessionUser?.id ?? null,
    50,
  );

  if (!feedResult.success) {
    notFound();
  }

  return (
    <FeedClient
      initialItems={feedResult.data.items}
      currentUser={sessionUser}
      context="profile"
      profileUser={feedResult.data.profileUser}
    />
  );
}
