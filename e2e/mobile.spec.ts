import { test, expect } from "@playwright/test";

test("Explorer is the default mobile tab, and Terminal is reachable and functional", async ({
  page,
}) => {
  await page.goto("/projects/smsnet");

  await expect(page.getByRole("heading", { name: "SMSNet" })).toBeVisible();
  await expect(page.locator("#terminal-input")).toBeHidden();

  await page.getByRole("button", { name: "Terminal" }).click();

  await expect(page.locator("#terminal-input")).toBeVisible();
  await expect(page.getByRole("heading", { name: "SMSNet" })).toBeHidden();

  // The Explorer panel stays mounted (hidden, not removed) even on mobile,
  // to preserve state across tab switches — so scope to the Terminal
  // region specifically rather than the whole page.
  const terminal = page.getByLabel("Terminal", { exact: true });
  const input = page.locator("#terminal-input");
  await input.fill("pwd");
  await input.press("Enter");
  await expect(
    terminal.getByText("root/projects/smsnet", { exact: true }),
  ).toBeVisible();
});

test("switching back to Explorer preserves terminal history", async ({
  page,
}) => {
  await page.goto("/projects/smsnet");
  await page.getByRole("button", { name: "Terminal" }).click();

  const terminal = page.getByLabel("Terminal", { exact: true });
  const input = page.locator("#terminal-input");
  await input.fill("ls");
  await input.press("Enter");
  await expect(
    terminal.getByText("SMSNet", { exact: true }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Explorer" }).click();
  await expect(page.getByRole("heading", { name: "SMSNet" })).toBeVisible();

  await page.getByRole("button", { name: "Terminal" }).click();
  // The earlier `ls` output is still there — switching tabs didn't remount it.
  await expect(
    terminal.getByText("WalletRadar", { exact: true }),
  ).toBeVisible();
});
