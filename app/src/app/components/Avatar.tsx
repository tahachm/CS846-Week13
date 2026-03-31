type AvatarProps = {
  avatarKey: string | null;
  name: string;
  size?: "sm" | "md" | "lg";
};

function getAvatarClasses(avatarKey: string | null): string {
  switch (avatarKey) {
    case "sunny":
      return "bg-yellow-100 text-yellow-800";
    case "moon":
      return "bg-slate-800 text-slate-100";
    case "star":
      return "bg-indigo-100 text-indigo-800";
    case "wave":
      return "bg-blue-100 text-blue-800";
    case "leaf":
      return "bg-green-100 text-green-800";
    case "mountain":
      return "bg-stone-200 text-stone-800";
    case "cloud":
      return "bg-sky-100 text-sky-800";
    case "flame":
      return "bg-orange-100 text-orange-800";
    case "bolt":
      return "bg-yellow-200 text-yellow-900";
    case "planet":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-200 text-gray-700";
  }
}

function getSizeClasses(size: "sm" | "md" | "lg"): string {
  if (size === "sm") return "h-6 w-6 text-[10px]";
  if (size === "lg") return "h-16 w-16 text-xl";
  return "h-9 w-9 text-xs";
}

export function Avatar({ avatarKey, name, size = "md" }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const colorClasses = getAvatarClasses(avatarKey);
  const sizeClasses = getSizeClasses(size);

  return (
    <div
      className={`${sizeClasses} flex-shrink-0 rounded-full ${colorClasses} flex items-center justify-center font-semibold`}
      aria-hidden="true"
    >
      {initial}
    </div>
  );
}
