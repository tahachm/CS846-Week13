import { test, expect } from "@playwright/test";

const PASSWORD = "password123";

// This test assumes the dev database has been seeded with the default users
// from prisma/seed.ts (for example, alice@example.com with password123).

test("seeded user can log in and see global feed", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel("Email").fill("alice@example.com");
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  // After successful login we should land on the home page and see the feed UI.
  await expect(page).toHaveURL(/\//);
  await expect(page.getByRole("heading", { name: "Global Feed" })).toBeVisible();
});
