import { test, expect } from "@playwright/test";

const PASSWORD = "password123";

async function registerViaUi(page: any, email: string, username: string) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign up" }).click();
}

async function loginViaUi(page: any, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
}

test("login and create post appears in feed", async ({ page }) => {
  const email = `playwright-${Date.now()}@example.com`;
  const username = `pwuser-${Date.now()}`;

  await registerViaUi(page, email, username);
  // After registration we are redirected home and logged in.

  const content = "Playwright post from test";
  await expect(page.getByText("Compose a post")).toBeVisible();
  const textarea = page.getByPlaceholder("What's happening?");
  await textarea.fill(content);
  await page.getByRole("button", { name: "Post" }).click();

  // Use a more specific locator to avoid strict mode violations
  const postArticle = page.getByRole("article").filter({ hasText: content }).first();
  await expect(postArticle).toBeVisible();
});
