import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getUserFeed } from "@/lib/posts";
import { FeedClient } from "@/app/components/FeedClient";

type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ before?: string }>;
};

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { before } = await searchParams;
  const beforeDate = before ? new Date(before) : undefined;
  const sessionUser = await getCurrentUser();
  const feedResult = await getUserFeed(
    username,
    sessionUser?.id ?? null,
    50,
    beforeDate,
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
