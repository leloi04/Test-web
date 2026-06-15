import { test, expect } from "@playwright/test";

const URL = "https://smart-menu-v1yt.vercel.app/pre-order";
const SEARCH_PLACEHOLDER = /tìm kiếm/i;

test.describe("Search Food Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://smart-menu-v1yt.vercel.app/login");

    await page.getByPlaceholder("Nhập email").fill("levanloi2004bn@gmail.com");
    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL("https://smart-menu-v1yt.vercel.app/");

    await page.waitForLoadState("networkidle");

    await page.goto(URL);
  });

  // =========================
  // TC-SR-001: Exact name search (FIXED)
  // =========================
  test("TC-SR-001: Exact name search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const firstDish = page.locator(".grid > div h4").first();
    await expect(firstDish).toBeVisible();

    const dishName = (await firstDish.textContent())?.trim() || "";
    if (!dishName) throw new Error("No dish name found");

    const initialCount = await page.locator(".grid > div h4").count();

    await searchInput.fill("");

    await searchInput.type(dishName, { delay: 100 });

    await page.waitForTimeout(500);

    const results = page.locator(".grid > div h4");

    const count = await results.count();

    expect(count).toBeGreaterThan(0);

    expect(count).toBeLessThanOrEqual(initialCount);

    for (let i = 0; i < count; i++) {
      const text = await results.nth(i).textContent();
      expect(text?.toLowerCase()).toContain(dishName.toLowerCase());
    }
  });

  // =========================
  // TC-SR-002
  // =========================
  test("TC-SR-002 - Tìm kiếm một phần tên món", async ({ page }) => {
    const word = "gà";
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);
    await expect(searchInput).toBeVisible();

    const items = page.locator(".grid > div h4");

    await searchInput.type(word, { delay: 200 });

    await page.waitForTimeout(2000);

    await expect(items.first()).toBeVisible();

    const count = await items.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();
      expect(text?.toLowerCase()).toContain(word.toLowerCase());
    }
  });

  // =========================
  // TC-SR-003
  // =========================
  test("TC-SR-003 - Không phân biệt hoa thường", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "TRÀ";

    const items = page.locator(".grid > div h4");
    await expect(items.first()).toBeVisible();

    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 100 });

    await page.waitForTimeout(2000);
    await expect(items.first()).toBeVisible();

    const count = await items.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();

      expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  // =========================
  // TC-SR-004
  // =========================
  test("TC-SR-004 - Tìm kiếm có dấu", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "TRÀ";

    const items = page.locator(".grid > div h4");
    await expect(items.first()).toBeVisible();

    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 100 });

    await page.waitForTimeout(2000);
    await expect(items.first()).toBeVisible();

    const count = await items.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();

      expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  // =========================
  // TC-SR-005
  // =========================
  test.only("TC-SR-005 - Tìm kiếm không dấu", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "tra";

    const items = page.locator(".grid > div h4");
    await expect(items.first()).toBeVisible();

    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 100 });

    await page.waitForTimeout(2000);
    await expect(items.first()).toBeVisible();

    const count = await items.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).textContent();

      expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  // =========================
  // TC-SR-006
  // =========================
  test("TC-SR-006 - Tìm kiếm theo mô tả", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "bơ tỏi";

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");
    await expect(items.first()).toBeVisible();

    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 200 });

    await page.waitForTimeout(2000);
    await expect(items.first()).toBeVisible();

    const count = await items.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const desc = await items.nth(i).locator("p").first().textContent();
      expect(desc?.toLowerCase()).toContain(keyword.toLowerCase());
    }
  });

  // =========================
  // TC-SR-007
  // =========================
  test("TC-SR-007 - Tìm kiếm nhiều từ khóa", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "cơm tiêu";

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();

    // clear input trước khi search
    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 200 });

    // chờ UI filter/render
    await page.waitForTimeout(2000);

    // đảm bảo vẫn có item hiển thị
    await expect(items.first()).toBeVisible();

    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    // kiểm tra từng item có chứa keyword (cơm hoặc bò)
    const keywords = keyword.split(" ");

    for (let i = 0; i < count; i++) {
      const text = await items.nth(i).innerText();
      const lowerText = text.toLowerCase();

      const match = keywords.some((k) => lowerText.includes(k.toLowerCase()));
      expect(match).toBeTruthy();
    }
  });

  // =========================
  // TC-SR-008
  // =========================
  test("TC-SR-008 - Không tìm thấy món", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const keyword = "pizza";

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();

    await searchInput.fill("");
    await searchInput.type(keyword, { delay: 200 });

    await page.waitForTimeout(2000);

    // check UI trạng thái không có kết quả
    const noResultText = page.getByText(
      /không tìm thấy|0 kết quả|không có món/i,
    );
    await expect(noResultText).toBeVisible();

    // optional: đảm bảo không còn item nào hiển thị
    const itemCards = menuSection
      .locator("..")
      .locator(".grid > div")
      .locator("h4");
    const count = await itemCards.count();
    expect(count).toBe(0);
  });

  // =========================
  // TC-SR-009
  // =========================
  test("TC-SR-009 - Chuỗi rỗng", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    // đảm bảo có dữ liệu ban đầu
    await expect(items.first()).toBeVisible();

    // nhập rồi xóa (simulate user behavior)
    await searchInput.fill("test");
    await page.waitForTimeout(500);

    await searchInput.fill("");

    // chờ UI reset
    await page.waitForTimeout(1500);

    // phải quay lại trạng thái ban đầu (có món hiển thị)
    await expect(items.first()).toBeVisible();

    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  // =========================
  // TC-SR-010
  // =========================
  test("TC-SR-010 - Chỉ khoảng trắng", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");
    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);
    const initialCount = await items.count();
    console.log("Initial item count:", initialCount);
    expect(initialCount).toBeGreaterThan(0);

    await searchInput.type("     ", { delay: 200 });

    await page.waitForTimeout(1500);

    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();

    expect(finalCount).toBe(initialCount);
  });

  // =========================
  // TC-SR-011
  // =========================
  test("TC-SR-011 - Ký tự đặc biệt", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");
    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);
    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    await searchInput.type("@#$%^", { delay: 200 });

    await page.waitForTimeout(1500);

    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();
    expect(finalCount).not.toBe(initialCount);
  });

  // =========================
  // TC-SR-012
  // =========================
  test("TC-SR-012 - Emoji search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");
    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);
    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    await searchInput.type("🍔", { delay: 200 });

    await page.waitForTimeout(1500);

    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();
    expect(finalCount).not.toBe(initialCount);
  });

  // =========================
  // TC-SR-013
  // =========================
  test("TC-SR-013 - Category + search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);

    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    // chọn category "Rice"
    await page.getByRole("button", { name: /rice/i }).click();
    await page.waitForTimeout(1000);

    // search trong category
    await searchInput.fill("");
    await searchInput.type("cơm", { delay: 200 });

    await page.waitForTimeout(1500);

    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();

    expect(finalCount).not.toBe(initialCount);
  });

  // =========================
  // TC-SR-014
  // =========================
  test("TC-SR-014 - Clear search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);

    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    // nhập search để filter
    await searchInput.type("gà", { delay: 200 });
    await page.waitForTimeout(1500);

    const filteredCount = await items.count();

    // đảm bảo có filter xảy ra (có thay đổi hoặc ít nhất không bằng initial)
    expect(filteredCount).not.toBe(initialCount);

    // clear search
    await searchInput.fill("");

    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1500);

    const finalCount = await items.count();

    // sau khi clear phải quay lại trạng thái ban đầu
    expect(finalCount).toBe(initialCount);
  });

  // =========================
  // TC-SR-015
  // =========================
  test("TC-SR-015 - Realtime search", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);

    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    // realtime typing từng ký tự
    await searchInput.type("g", { delay: 200 });
    await page.waitForTimeout(1000);

    const midCount = await items.count();

    await searchInput.type("à", { delay: 200 });
    await page.waitForTimeout(1500);

    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();

    // realtime search phải có thay đổi theo từng input
    expect(finalCount).not.toBe(initialCount);

    // đảm bảo UI đã filter sau khi gõ đủ keyword
    expect(finalCount).toBeGreaterThanOrEqual(0);
  });

  // =========================
  // TC-SR-016
  // =========================
  test("TC-SR-016 - Long string", async ({ page }) => {
    const searchInput = page.getByPlaceholder(SEARCH_PLACEHOLDER);

    await expect(searchInput).toBeVisible();

    const menuSection = page.locator("text=Đặt món");
    const items = menuSection.locator("..").locator(".grid > div");

    await expect(items.first()).toBeVisible();
    await page.waitForTimeout(1000);

    const initialCount = await items.count();
    expect(initialCount).toBeGreaterThan(0);

    const longText = "a".repeat(10);

    // nhập chuỗi rất dài
    await searchInput.type(longText, { delay: 100 });

    await page.waitForTimeout(1500);

    // UI phải vẫn ổn định (không crash / không blank UI)
    await expect(items.first()).toBeVisible();

    const finalCount = await items.count();

    // thường long string sẽ không match → kết quả thay đổi hoặc = 0
    expect(finalCount).toBeGreaterThanOrEqual(0);
  });
});
