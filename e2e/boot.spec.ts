import { test, expect } from "@playwright/test";

test("the boot sequence plays real commands and ends on About, with the Explorer following live", async ({
  page,
}) => {
  await page.goto("/");

  // The terminal is read-only while the scripted boot sequence runs.
  await expect(page.locator("#terminal-input")).toHaveAttribute("readonly");

  // It ends by navigating to /about for real — wait for that rather than a
  // fixed sleep, since the exact boot duration is an implementation detail.
  await expect(page).toHaveURL(/\/about$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  await expect(page.locator("#terminal-input")).not.toHaveAttribute(
    "readonly",
  );

  // The Explorer visibly moved through the same commands, not just the URL.
  await expect(page.getByText("Opened About")).toBeVisible();
});

test("clicking during boot skips it immediately, leaving root untouched", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByText("Welcome").click();

  await expect(page.locator("#terminal-input")).not.toHaveAttribute(
    "readonly",
  );
  await expect(page).toHaveURL("/");
});

test("a deep link is never hijacked by the boot sequence", async ({
  page,
}) => {
  await page.goto("/projects/walletradar");

  await expect(page.locator("#terminal-input")).not.toHaveAttribute(
    "readonly",
  );
  await expect(page).toHaveURL(/\/projects\/walletradar$/);
  await expect(
    page.getByRole("heading", { name: "WalletRadar" }),
  ).toBeVisible();
});
