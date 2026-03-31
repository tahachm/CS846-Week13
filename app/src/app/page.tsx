import { getCurrentUser } from "@/lib/auth";
import { getGlobalFeed } from "@/lib/posts";
import { FeedClient } from "@/app/components/FeedClient";

type HomeProps = {
  searchParams: Promise<{ before?: string }>;
};

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: HomeProps) {
  const { before } = await searchParams;
  const beforeDate = before ? new Date(before) : undefined;
  const sessionUser = await getCurrentUser();
  const feedResult = await getGlobalFeed(sessionUser?.id ?? null, 50, beforeDate);

  const items = feedResult.success ? feedResult.data : [];

  return (
    <FeedClient
      initialItems={items}
      currentUser={sessionUser}
      context="global"
    />
  );
}
