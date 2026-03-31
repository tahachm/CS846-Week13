import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { logInfo, logWarn } from "@/lib/logger";
import { BIO_MAX_LENGTH } from "@/lib/validation";
import { BioFieldWithCounter } from "@/app/profile/BioFieldWithCounter";

export default async function EditProfilePage() {
  const user = await requireCurrentUser();

  const existing = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      displayName: true,
      bio: true,
      avatarKey: true,
    },
  });

  async function handleUpdate(formData: FormData) {
    "use server";

    const currentUser = await requireCurrentUser();

    const displayName = String(formData.get("displayName") ?? "").trim();
    const bio = String(formData.get("bio") ?? "");
    const avatarKey = String(formData.get("avatarKey") ?? "").trim() || null;

    if (bio.length > BIO_MAX_LENGTH) {
      logWarn("update_profile", {
        action: "update_profile",
        userId: currentUser.id,
        success: false,
        errorCode: "BIO_TOO_LONG",
      });
      redirect("/profile/edit?error=bio_too_long");
    }

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        displayName: displayName || null,
        bio: bio || null,
        avatarKey,
      },
    });

    logInfo("update_profile", {
      action: "update_profile",
      userId: currentUser.id,
      success: true,
    });

    redirect(`/users/${currentUser.username}`);
  }

  const avatarOptions = [
    "sunny",
    "moon",
    "star",
    "wave",
    "leaf",
    "mountain",
    "cloud",
    "flame",
    "bolt",
    "planet",
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Edit profile</h1>
        <form action={handleUpdate} className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="displayName"
            >
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              defaultValue={existing?.displayName ?? ""}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          </div>
          <BioFieldWithCounter
            initialBio={existing?.bio ?? ""}
            maxLength={BIO_MAX_LENGTH}
          />
          <div>
            <span className="mb-1 block text-sm font-medium">Avatar</span>
            <div className="grid grid-cols-5 gap-3">
              <label className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <input
                  type="radio"
                  name="avatarKey"
                  value=""
                  defaultChecked={!existing?.avatarKey}
                  className="peer sr-only"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50 text-[10px] font-medium peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-500">
                  None
                </div>
              </label>
              {avatarOptions.map((key) => (
                <label
                  key={key}
                  className="flex flex-col items-center gap-1 text-xs text-gray-700"
                >
                  <input
                    type="radio"
                    name="avatarKey"
                    value={key}
                    defaultChecked={existing?.avatarKey === key}
                    className="peer sr-only"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-[10px] font-semibold capitalize peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 peer-checked:ring-2 peer-checked:ring-blue-500">
                    {key}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/users/${user.username}`}
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
