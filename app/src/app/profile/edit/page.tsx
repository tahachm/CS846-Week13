import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { logInfo, logWarn } from "@/lib/logger";

const BIO_MAX_LENGTH = 160;

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
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={existing?.bio ?? ""}
              maxLength={BIO_MAX_LENGTH}
              className="w-full rounded border px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Up to {BIO_MAX_LENGTH} characters.
            </p>
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="avatarKey"
            >
              Avatar
            </label>
            <select
              id="avatarKey"
              name="avatarKey"
              defaultValue={existing?.avatarKey ?? ""}
              className="w-full rounded border px-3 py-2 text-sm"
            >
              <option value="">No avatar</option>
              {avatarOptions.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Save changes
          </button>
        </form>
      </div>
    </main>
  );
}
