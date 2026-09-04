import { test, expect } from "@playwright/test";

test("the boot sequence connects, plays real commands, then clears and ends on root with help listed", async ({
  page,
}) => {
  await page.goto("/");

  // The terminal is read-only while the scripted boot sequence runs.
  await expect(page.locator("#terminal-input")).toHaveAttribute("readonly");

  // The opening `connect` banner shows before the rest of the sequence
  // plays — real commands run through the real engine, not scripted text.
  await expect(page.getByText(/connecting to anatolikot cli/i)).toBeVisible();

  // It ends with `clear`, `cd root`, `help` — wait for the input to unlock
  // rather than a fixed sleep, since the exact boot duration is an
  // implementation detail.
  await expect(page.locator("#terminal-input")).not.toHaveAttribute(
    "readonly",
    { timeout: 15_000 },
  );
  await expect(page).toHaveURL(/\/$/);

  // The closing `clear` wiped the earlier commands' output, including the
  // opening banner — only `cd root` and `help`'s listing remain.
  await expect(
    page.getByText(/connecting to anatolikot cli/i),
  ).not.toBeVisible();
  await expect(page.getByText("cd root")).toBeVisible();
  await expect(
    page.getByText(/connect — connect to the anatolikot cli/i),
  ).toBeVisible();
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
