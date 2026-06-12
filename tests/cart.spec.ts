import { test, expect } from "@playwright/test";

const URL = "https://smart-menu-v1yt.vercel.app/cart";

test.describe("Check out cart", () => {
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

    await page.getByRole("link", { name: /giỏ hàng/i }).click();

    await page.getByRole("button", { name: /đi đặt món/i }).click();

    const addButtons = page.getByRole("button", { name: /thêm vào giỏ/i });

    const itemsToAdd = 2;
    const modalAddButton = page.getByRole("button", {
      name: /thêm vào giỏ -/i,
    });

    for (let i = 0; i < itemsToAdd; i++) {
      await addButtons.nth(i).click();
      await modalAddButton.click();
    }

    await page.getByRole("button", { name: /giỏ hàng/i }).click();

    await page.waitForTimeout(2000);
  });

  //   =========================
  //   TC-CT-001 Giỏ hàng trống
  //   =========================
  test("TC-CT-001 - Giỏ hàng trống", async ({ page }) => {
    while (await page.locator(".items-start").first().isVisible()) {
      await page
        .locator(".items-start")
        .first()
        .getByRole("button", { name: /xóa/i })
        .click();

      await page.waitForTimeout(800);
    }
    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-002 Thêm món vào giỏ hàng
  //   =========================
  test("TC-CT-002 - Thêm món vào giỏ hàng", async ({ page }) => {
    while (await page.locator(".items-start").first().isVisible()) {
      await page
        .locator(".items-start")
        .first()
        .getByRole("button", { name: /xóa/i })
        .click();

      await page.waitForTimeout(800);
    }
    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1000);

    await page.getByRole("button", { name: /đi đặt món/i }).click();

    const addButtons = page.getByRole("button", { name: /thêm vào giỏ/i });

    const modalAddButton = page.getByRole("button", {
      name: /thêm vào giỏ -/i,
    });

    await addButtons.nth(0).click();
    await modalAddButton.click();

    await page.getByRole("button", { name: /giỏ hàng/i }).click();

    await expect(page.getByText(/giỏ hàng trống/i)).not.toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-003 Xóa món khỏi giỏ hàng
  //   =========================
  test("TC-CT-003 - Xóa món khỏi giỏ hàng", async ({ page }) => {
    const cartItems = page.locator(".items-start");

    const beforeCount = await cartItems.count();
    expect(beforeCount).toBeGreaterThan(0);

    await cartItems.first().getByRole("button", { name: /xóa/i }).click();

    await page.waitForTimeout(1000);

    const afterCount = await cartItems.count();

    expect(afterCount).toBeLessThan(beforeCount);
  });

  //   =========================
  //   TC-CT-004 Sửa thông tin món
  //   =========================
  test("TC-CT-004 - Sửa thông tin món", async ({ page }) => {
    const cartItems = page.locator(".items-start");

    await cartItems.first().getByRole("button", { name: /sửa/i }).click();

    await page.waitForTimeout(800);

    const modal = page.locator(".fixed.inset-0");
    await expect(modal).toBeVisible();

    const sizeButtons = modal
      .locator("text=Size")
      .locator("..")
      .getByRole("button");
    if ((await sizeButtons.count()) > 1) {
      await sizeButtons.nth(1).click();
    }

    await page.waitForTimeout(800);

    const toppingButtons = modal
      .locator("text=Toppings")
      .locator("..")
      .getByRole("button");
    if ((await toppingButtons.count()) > 0) {
      await toppingButtons.first().click();
    }

    await page.waitForTimeout(800);

    await modal.getByRole("button", { name: "+" }).click();

    await page.waitForTimeout(1000);

    await modal.getByRole("button", { name: /lưu thay đổi/i }).click();

    await expect(modal).toBeHidden();

    await expect(cartItems.first()).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-005 Giảm số lượng của món về 0
  //   =========================
  test("TC-CT-005 - Giảm số lượng của món về 0", async ({ page }) => {
    const cartItems = page.locator(".items-start");

    const firstItem = cartItems.first();

    await expect(firstItem).toBeVisible();

    const minusBtn = firstItem.getByRole("button", { name: "-" });

    const start = Date.now();
    const timeout = 3000;

    while (Date.now() - start < timeout) {
      // kiểm tra còn tồn tại không
      if (!(await firstItem.isVisible())) break;

      await minusBtn.click().catch(() => {});
      await page.waitForTimeout(200);
    }

    await expect(firstItem).not.toBeVisible();
  });

  //   =========================
  //   TC-CT-006 Thanh toán giỏ hàng đến lấy thiếu thời gian
  //   =========================
  test("TC-CT-006 - Thanh toán giỏ hàng đến lấy thiếu thời gian", async ({
    page,
  }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /đến lấy/i }).click();

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/thiếu thông tin/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-007 Thanh toán giỏ hàng đến lấy theo COD
  //   =========================
  test("TC-CT-007 - Thanh toán giỏ hàng đến lấy theo COD", async ({ page }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /đến lấy/i }).click();

    const timeInput = page.locator('input[type="time"]');
    await expect(timeInput).toBeVisible();

    await timeInput.fill("22:00");

    await page.getByRole("radio").first().check();

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-008 Thanh toán giỏ hàng đến lấy theo ngân hàng
  //   =========================
  test("TC-CT-008 - Thanh toán giỏ hàng đến lấy theo ngân hàng", async ({
    page,
  }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /đến lấy/i }).click();

    const timeInput = page.locator('input[type="time"]');
    await expect(timeInput).toBeVisible();

    await timeInput.fill("22:00");

    await page.getByRole("radio").nth(1).check();

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-009 Thanh toán giỏ hàng theo giao hàng không nhập địa chỉ
  //   =========================
  test("TC-CT-009 - Thanh toán giỏ hàng theo giao hàng không nhập địa chỉ", async ({
    page,
  }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /giao hàng/i }).click();

    await page.waitForTimeout(800);

    const addressInput = page.getByPlaceholder(/nhập địa chỉ/i);

    await expect(addressInput).toBeVisible();

    await addressInput.fill("");

    await page.waitForTimeout(800);

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/thiếu thông tin/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-010 Thanh toán giỏ hàng theo giao hàng COD có địa chỉ
  //   =========================
  test("TC-CT-010 - Thanh toán giỏ hàng theo giao hàng COD có địa chỉ", async ({
    page,
  }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /giao hàng/i }).click();

    await page.waitForTimeout(800);

    const addressInput = page.getByPlaceholder(/nhập địa chỉ/i);

    await expect(addressInput).toBeVisible();

    await addressInput.type("Tu Son", { delay: 200 });

    await page.waitForTimeout(5000);

    await page.getByRole("radio").first().check();

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-011 Thanh toán giỏ hàng theo giao hàng ngân hàng có địa chỉ
  //   =========================
  test("TC-CT-011 - Thanh toán giỏ hàng theo giao hàng ngân hàng có địa chỉ", async ({
    page,
  }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /giao hàng/i }).click();

    await page.waitForTimeout(800);

    const addressInput = page.getByPlaceholder(/nhập địa chỉ/i);

    await expect(addressInput).toBeVisible();

    await addressInput.type("Tu Son", { delay: 200 });

    await page.waitForTimeout(5000);

    await page.getByRole("radio").nth(1).check();

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/giỏ hàng trống/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  //   =========================
  //   TC-CT-012 Thanh toán giỏ hàng nhập sai địa chỉ
  //   =========================
  test("TC-CT-012 - Thanh toán giỏ hàng nhập sai địa chỉ", async ({ page }) => {
    const checkoutBox = page
      .locator(".bg-white.p-6")
      .getByRole("heading", { name: /thanh toán/i });

    await expect(checkoutBox).toBeVisible();

    await page.getByRole("button", { name: /giao hàng/i }).click();

    await page.waitForTimeout(800);

    const addressInput = page.getByPlaceholder(/nhập địa chỉ/i);

    await expect(addressInput).toBeVisible();

    await addressInput.fill("sdalsdkkou");

    await page.waitForTimeout(800);

    const submitBtn = page.getByRole("button", {
      name: /xác nhận đặt món/i,
    });

    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForTimeout(2000);

    await expect(page.getByText(/nhập địa chỉ khác/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });
});
