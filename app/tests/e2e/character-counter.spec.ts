import { test, expect } from "@playwright/test";

const PASSWORD = "password123";

async function registerAndLogin(page: any, email: string, username: string) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();
}

test("character counter reflects limits and disables when over limit", async ({ page }) => {
  const email = `counter-${Date.now()}@example.com`;
  const username = `counteruser-${Date.now()}`;

  await registerAndLogin(page, email, username);

  const textarea = page.getByPlaceholder("What's happening?");
  await expect(textarea).toBeVisible();

  const shortText = "short post";
  await textarea.fill(shortText);
  await expect(page.getByText(/\d+ \/ 280/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Post" })).toBeEnabled();

  const longText = "x".repeat(281);
  await textarea.fill(longText);
  await expect(page.getByText(/281 \/ 280/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Post" })).toBeDisabled();
});
