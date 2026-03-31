import { getCurrentUser } from "@/lib/auth";
import { getGlobalFeed } from "@/lib/posts";
import { FeedClient } from "@/app/components/FeedClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sessionUser = await getCurrentUser();
  const feedResult = await getGlobalFeed(sessionUser?.id ?? null, 50);

  const items = feedResult.success ? feedResult.data : [];

  return (
    <FeedClient
      initialItems={items}
      currentUser={sessionUser}
      context="global"
    />
  );
}
