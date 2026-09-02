import { test, expect } from "@playwright/test";

test("a deep link loads directly with the Explorer and terminal already in sync", async ({
  page,
}) => {
  await page.goto("/projects/smsnet");

  await expect(page.getByRole("heading", { name: "SMSNet" })).toBeVisible();
  await expect(
    page.getByLabel("root/projects/smsnet >", { exact: true }),
  ).toBeVisible();
});

test("an unknown path renders the not-found page", async ({ page }) => {
  const response = await page.goto("/this-path-does-not-exist");
  expect(response?.status()).toBe(404);
});

test("the Back button navigates to the parent folder", async ({ page }) => {
  await page.goto("/projects/smsnet");

  await page.getByRole("link", { name: "Back" }).click();

  // A folder view has no <h1> — it's a card grid, not a detail page.
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Projects");
  await expect(page.getByRole("link", { name: /WalletRadar/ })).toBeVisible();
});

test("Back is not interactive at the root", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("link", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/$/);

  await expect(
    page.getByRole("link", { name: "Back" }),
  ).not.toBeVisible();
});

test("browsing into an intentionally empty folder shows the maintenance notice", async ({
  page,
}) => {
  await page.goto("/programming");
  await expect(page.getByText("UnmountedSectionError")).toBeVisible();
});
