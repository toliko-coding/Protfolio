import { test, expect } from "@playwright/test";

// Landing on a deep link skips the boot sequence entirely (see Terminal.tsx),
// which keeps these tests independent of the terminal's animation timing.

test("terminal open updates the Explorer breadcrumb", async ({ page }) => {
  // smsnet is a project (leaf node) — `cd` only works on folders, `open` is
  // the command for leaves, per the Phase 2 command contract.
  await page.goto("/projects");

  const input = page.locator("#terminal-input");
  await input.fill("open smsnet");
  await input.press("Enter");

  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("SMSNet");
  await expect(page.getByRole("heading", { name: "SMSNet" })).toBeVisible();
});

test("terminal open navigates the Explorer to the project detail view", async ({
  page,
}) => {
  await page.goto("/projects");

  const input = page.locator("#terminal-input");
  await input.fill("open walletradar");
  await input.press("Enter");

  await expect(page).toHaveURL(/\/projects\/walletradar$/);
  await expect(
    page.getByRole("heading", { name: "WalletRadar" }),
  ).toBeVisible();
});

test("clicking an Explorer card updates the terminal's live prompt", async ({
  page,
}) => {
  await page.goto("/projects");

  await page.getByRole("link", { name: /SMSNet/ }).click();

  await expect(page).toHaveURL(/\/projects\/smsnet$/);
  await expect(
    page.getByLabel("root/projects/smsnet >", { exact: true }),
  ).toBeVisible();
});

test("terminal pwd reflects navigation done via the Explorer", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: /WalletRadar/ }).click();
  await expect(page).toHaveURL(/\/projects\/walletradar$/);

  const input = page.locator("#terminal-input");
  await input.fill("pwd");
  await input.press("Enter");

  await expect(
    page.getByText("root/projects/walletradar", { exact: true }),
  ).toBeVisible();
});
