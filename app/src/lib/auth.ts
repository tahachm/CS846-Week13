"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { logInfo, logWarn, logError } from "@/lib/logger";
import bcrypt from "bcryptjs";

const SESSION_COOKIE_NAME = "sessionUserId";

export type SessionUser = {
  id: number;
  email: string;
  username: string;
};

export async function registerUser(input: {
  email: string;
  username: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, username, password } = input;

  if (!email || !username || !password) {
    logWarn("register_user", {
      action: "register_user",
      success: false,
      errorCode: "VALIDATION_ERROR",
    });
    return { success: false, error: "Missing required fields" };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    logInfo("register_user", {
      action: "register_user",
      userId: user.id,
      success: true,
    });

    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown registration error";

    const isUniqueViolation = message.includes("Unique constraint failed");

    logError("register_user", {
      action: "register_user",
      success: false,
      errorCode: isUniqueViolation ? "UNIQUE_CONSTRAINT" : "DB_ERROR",
    });

    return {
      success: false,
      error: isUniqueViolation
        ? "Email or username already in use"
        : "Failed to register user",
    };
  }
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, password } = input;

  if (!email || !password) {
    logWarn("login", {
      action: "login",
      success: false,
      errorCode: "VALIDATION_ERROR",
    });
    return { success: false, error: "Missing email or password" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      logWarn("login", {
        action: "login",
        success: false,
        errorCode: "AUTH_ERROR",
      });
      return { success: false, error: "Invalid credentials" };
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      logWarn("login", {
        action: "login",
        userId: user.id,
        success: false,
        errorCode: "AUTH_ERROR",
      });
      return { success: false, error: "Invalid credentials" };
    }

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    logInfo("login", {
      action: "login",
      userId: user.id,
      success: true,
    });

    return { success: true };
  } catch {
    logError("login", {
      action: "login",
      success: false,
      errorCode: "DB_ERROR",
    });
    return { success: false, error: "Failed to login" };
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  const current = cookieStore.get(SESSION_COOKIE_NAME);

  if (current) {
    const userId = Number.parseInt(current.value, 10);
    logInfo("logout", {
      action: "logout",
      userId: Number.isNaN(userId) ? undefined : userId,
      success: true,
    });
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const current = cookieStore.get(SESSION_COOKIE_NAME);

  if (!current) return null;

  const id = Number.parseInt(current.value, 10);
  if (Number.isNaN(id)) return null;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  if (!user) return null;

  return user;
}

export async function requireCurrentUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
