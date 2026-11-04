import { expect, test, type Page } from "@playwright/test";

type StoredDay = { day: number; hasHardViolation: boolean; meals: { slot: string; recipeId: string; locked?: boolean }[] };
type Stored = { plan: { id: string; days: StoredDay[] } | null; checks: Record<string, string[]> };

const stored = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("medplate:v1") ?? "null")) as Promise<Stored>;

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  return errors;
}

test("diabetic + CKD stage 4: onboard, plan, swap, lock, regenerate, shop, report", async ({ page }) => {
  const errors = watchErrors(page);

  await page.goto("/");
  await page.getByRole("link", { name: "Build my plan" }).click();

  // Step 1 – diets
  await page.getByLabel(/Diabetes/).check();
  await page.getByLabel("Chronic kidney disease").check();
  await page.getByLabel("Stage 4 (eGFR 15–29)").check();
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 2 – body + labs
  await expect(page.getByRole("heading", { name: "About you" })).toBeVisible();
  await page.getByLabel("Weight (kg)").fill("80");
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 3 – food
  await page.getByLabel("Shellfish").check();
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 4 – review limits
  const table = page.getByRole("table");
  await expect(table.getByRole("row", { name: /Potassium.*≤ 2,500 mg/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /Phosphorus.*≤ 900 mg/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /breakfast.*Carbohydrate.*≤ 60 g/i })).toBeVisible();
  await page.getByRole("button", { name: "Create my meal plan" }).click();

  // Plan
  // Plan generation is CPU-bound on the server; parallel workers queue behind each other.
  await expect(page).toHaveURL(/\/plan$/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: "Your week" })).toBeVisible();
  await expect(page.getByRole("tab")).toHaveCount(7);
  let s = await stored(page);
  expect(s.plan!.days).toHaveLength(7);
  expect(s.plan!.days.every((d) => !d.hasHardViolation)).toBe(true);

  // Meal detail dialog explains the fit
  const firstMeal = page.locator("#day-panel").getByRole("button").first();
  await firstMeal.click();
  const detail = page.getByRole("dialog");
  await expect(detail.getByRole("heading", { name: "How it fits your day" })).toBeVisible();
  await expect(detail.getByRole("cell", { name: "Potassium" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(detail).toBeHidden();

  // Swap lunch on day 1
  const before = s.plan!.days[0].meals.find((m) => m.slot === "lunch")!.recipeId;
  await page.locator("#day-panel").getByRole("button", { name: "Swap" }).nth(1).click();
  const swap = page.getByRole("dialog", { name: /Swap lunch/ });
  const fitting = swap.getByRole("button", { name: /within limits/ }).first();
  await expect(fitting).toBeVisible();
  await fitting.click();
  await expect(swap).toBeHidden();
  s = await stored(page);
  const after = s.plan!.days[0].meals.find((m) => m.slot === "lunch")!.recipeId;
  expect(after).not.toBe(before);
  expect(s.plan!.days[0].hasHardViolation).toBe(false);

  // Lock dinner, regenerate, dinner is kept
  await page.locator("#day-panel").getByRole("button", { name: "Lock" }).nth(2).click();
  s = await stored(page);
  const lockedDinner = s.plan!.days[0].meals.find((m) => m.slot === "dinner")!;
  expect(lockedDinner.locked).toBe(true);
  const oldId = s.plan!.id;
  await page.getByRole("button", { name: "Regenerate week" }).click();
  await expect.poll(async () => (await stored(page)).plan!.id, { timeout: 20_000 }).not.toBe(oldId);
  s = await stored(page);
  expect(s.plan!.days[0].meals.find((m) => m.slot === "dinner")).toMatchObject({ recipeId: lockedDinner.recipeId, locked: true });
  expect(s.plan!.days.every((d) => !d.hasHardViolation)).toBe(true);

  // Grocery list
  await page.getByRole("link", { name: "Grocery list" }).first().click();
  await expect(page.getByRole("heading", { name: "Grocery list" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Produce" })).toBeVisible();
  await expect(page.getByText(/no salt added|phosphate/i).first()).toBeVisible();
  const firstBox = page.getByRole("checkbox").first();
  await firstBox.check();
  await expect(page.getByText(/^1 \/ \d+ in cart$/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole("checkbox").first()).toBeChecked();

  // Dietitian report
  await page.goto("/report");
  await expect(page.getByRole("heading", { name: "Daily totals" })).toBeVisible();
  await expect(page.getByText("Stage 4 (eGFR 15–29)")).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});

test("low-FODMAP: excluded recipes are explained and reintroduction can be run", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto("/onboarding");
  await page.getByLabel("Low-FODMAP (IBS)").check();
  await page.getByLabel(/^Reintroduction/).check();
  for (let i = 0; i < 3; i++) await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Create my meal plan" }).click();
  await expect(page).toHaveURL(/\/plan$/, { timeout: 30_000 });

  await page.goto("/recipes/spaghetti-bolognese");
  await expect(page.getByText("Not planned for you")).toBeVisible();
  await expect(page.getByText(/High FODMAP/)).toBeVisible();

  await page.getByRole("link", { name: "FODMAP tests" }).click();
  await page.getByRole("button", { name: "Start test" }).first().click();
  await expect(page.getByRole("heading", { name: "Testing: Lactose" })).toBeVisible();
  await page.getByLabel(/Overall symptoms/).fill("6");
  await page.getByLabel("Bloating").check();
  await page.getByRole("button", { name: "Save today's log" }).click();
  await expect(page.getByText(/moderate or strong reaction/)).toBeVisible();
  await page.getByRole("button", { name: "It's a trigger for me" }).click();
  await expect(page.getByText("trigger", { exact: true })).toBeVisible();
  await expect(page.getByText(/Wait \d+ more day/)).toBeVisible();

  expect(errors, errors.join("\n")).toEqual([]);
});
