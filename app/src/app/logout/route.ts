import { redirect } from "next/navigation";

import { logoutUser } from "@/lib/auth";

export async function GET() {
  await logoutUser();
  redirect("/login");
}
