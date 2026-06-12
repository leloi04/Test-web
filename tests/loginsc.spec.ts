import { test, expect } from "@playwright/test";

const URL = "https://smart-menu-v1yt.vercel.app/login";

// Thay bằng tài khoản test của bạn
const VALID_EMAIL = "levanloi2004bn@gmail.com";
const VALID_PASSWORD = "123456";

test.describe("Login Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // ==========================
  // TC-LG-01 Login Success
  // ==========================
  test("TC-LG-01 - Đăng nhập thành công", async ({ page }) => {
    const currentUrl = page.url();

    await page.getByPlaceholder("Nhập email").fill(VALID_EMAIL);
    await page.getByPlaceholder("Nhập mật khẩu").fill(VALID_PASSWORD);

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await page.waitForLoadState("networkidle");

    await expect(page).not.toHaveURL(currentUrl);

    const token = await page.evaluate(() => {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("access_token")
      );
    });

    expect(page.url() !== currentUrl || token !== null).toBeTruthy();
  });

  // ==========================
  // TC-LG-02 Wrong Password
  // ==========================
  test("TC-LG-02 - Sai mật khẩu", async ({ page }) => {
    await page.getByPlaceholder("Nhập email").fill(VALID_EMAIL);

    await page.getByPlaceholder("Nhập mật khẩu").fill("WrongPassword123");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(URL);

    await expect(page.getByText(/đăng nhập thất bại/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  // ==========================
  // TC-LG-03 Email Not Exist
  // ==========================
  test("TC-LG-03 - Email không tồn tại", async ({ page }) => {
    await page.getByPlaceholder("Nhập email").fill("notexist999999@gmail.com");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(URL);

    await expect(page.getByText(/đăng nhập thất bại/i)).toBeVisible();

    await page.waitForTimeout(1500);
  });

  // ==========================
  // TC-LG-04 Empty Email
  // ==========================
  test("TC-LG-04 - Bỏ trống email", async ({ page }) => {
    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(URL);

    await expect(
      page.getByText(/vui lòng nhập đầy đủ thông tin/i),
    ).toBeVisible();

    await page.waitForTimeout(1500);
  });

  // ==========================
  // TC-LG-05 Empty Password
  // ==========================
  test("TC-LG-05 - Bỏ trống password", async ({ page }) => {
    await page.getByPlaceholder("Nhập email").fill("test@gmail.com");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(URL);

    await expect(
      page.getByText(/vui lòng nhập đầy đủ thông tin/i),
    ).toBeVisible();

    await page.waitForTimeout(1500);
  });

  // ==========================
  // TC-LG-06 Invalid Email Format
  // ==========================
  test("TC-LG-06 - Sai định dạng email", async ({ page }) => {
    await page.getByPlaceholder("Nhập email").fill("abc.com");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page
      .getByRole("button", {
        name: "Đăng nhập",
        exact: true,
      })
      .click();

    const errorMessage = page.getByText(
      /email không hợp lệ|email invalid|định dạng email/i,
    );

    await expect(errorMessage).toBeVisible();
  });

  // ==========================
  // TC-LG-07 Login Google
  // ==========================
  test("TC-LG-07 - Login Google", async ({ page, context }) => {
    await page.goto(URL);

    await page.waitForLoadState("networkidle");

    const googleBtn = page.getByRole("button", {
      name: /đăng nhập với google/i,
    });

    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      googleBtn.click(),
    ]);

    await popup.waitForLoadState();

    await expect(popup).toHaveURL(/accounts\.google\.com/);

    console.log("Google popup opened:", await popup.url());
  });
});
