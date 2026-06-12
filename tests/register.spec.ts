import { test, expect } from "@playwright/test";

const URL = "https://smart-menu-v1yt.vercel.app/register";

test.describe("Register Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  // ====================================
  // TC-RG-01: Đăng ký thành công
  // ====================================
  test("TC-RG-01 - Đăng ký thành công", async ({ page }) => {
    const email = `test${Date.now()}@gmail.com`;
    const currentUrl = URL;
    const randomNum = Math.floor(Math.random() * 100000000);

    await page.getByPlaceholder("Nhập email").fill(email);
    await page
      .getByPlaceholder("Nhập họ và tên")
      .fill(`Khách hàng mã số ${randomNum}`);
    await page.getByPlaceholder("Nhập số điện thoại").fill(`09${randomNum}`);
    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");
    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).not.toHaveURL(currentUrl);
  });

  // ====================================
  // TC-RG-02: Bỏ trống email
  // ====================================
  test("TC-RG-02 - Bỏ trống email", async ({ page }) => {
    const randomNum = Math.floor(Math.random() * 100000000);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");
    await page.getByPlaceholder("Nhập số điện thoại").fill(`09${randomNum}`);
    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");
    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText("Vui lòng nhập đầy đủ thông tin"),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-03: Email sai định dạng
  // ====================================
  test("TC-RG-03 - Email sai định dạng", async ({ page }) => {
    const randomNum = Math.floor(Math.random() * 100000000);

    await page.getByPlaceholder("Nhập email").fill("abc.com");
    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");
    await page.getByPlaceholder("Nhập số điện thoại").fill(`09${randomNum}`);
    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");
    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(page.getByText(/email không hợp lệ/i)).toBeVisible();
  });

  // ====================================
  // TC-RG-04: Bỏ trống họ tên
  // ====================================
  test("TC-RG-04 - Bỏ trống họ tên", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    const randomNum = Math.floor(Math.random() * 100000000);

    await page.getByPlaceholder("Nhập số điện thoại").fill(`09${randomNum}`);

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText(/vui lòng nhập đầy đủ thông tin/i),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-05: Bỏ trống số điện thoại
  // ====================================
  test("TC-RG-05 - Bỏ trống số điện thoại", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.waitForTimeout(1500);

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText(/vui lòng nhập đầy đủ thông tin/i),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-06: SĐT sai định dạng
  // ====================================
  test("TC-RG-06 - SĐT sai định dạng", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập số điện thoại").fill("123");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText(
        /Số điện thoại phải có 10 số và không chứa ký tự khác ngoài số/i,
      ),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-07: Bỏ trống mật khẩu
  // ====================================
  test("TC-RG-07 - Bỏ trống mật khẩu", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    const randomNum = Math.floor(Math.random() * 100000000);

    await page.getByPlaceholder("Nhập số điện thoại").fill(`09${randomNum}`);

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText(/Vui lòng nhập đầy đủ thông tin/i),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-08: Password quá ngắn
  // ====================================
  test("TC-RG-08 - Password quá ngắn", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập số điện thoại").fill("0987654321");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(page.getByText(/password quá ngắn/i)).toBeVisible();
  });

  // ====================================
  // TC-RG-09: Confirm Password không khớp
  // ====================================
  test("TC-RG-09 - Confirm Password không khớp", async ({ page }) => {
    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập số điện thoại").fill("0987654321");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("654321");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(
      page.getByText(/Mật khẩu và nhập lại mật khẩu không khớp/i),
    ).toBeVisible();
  });

  // ====================================
  // TC-RG-10: Email đã tồn tại
  // ====================================
  test("TC-RG-10 - Email đã tồn tại", async ({ page }) => {
    const email = "levanloi2004bn@gmail.com";

    await page.getByPlaceholder("Nhập email").fill(email);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập số điện thoại").fill("0987654321");

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(page.getByText(/email.*nay da ton tai/i)).toBeVisible();
  });

  // ====================================
  // TC-RG-11: Sdt đã tồn tại
  // ====================================
  test("TC-RG-11 - Sdt đã tồn tại", async ({ page }) => {
    const sdt = "0868318176";

    await page
      .getByPlaceholder("Nhập email")
      .fill(`test${Date.now()}@gmail.com`);

    await page.getByPlaceholder("Nhập họ và tên").fill("Lê Văn Lợi");

    await page.getByPlaceholder("Nhập số điện thoại").fill(`${sdt}`);

    await page.getByPlaceholder("Nhập mật khẩu").fill("123456");

    await page.getByPlaceholder("Nhập lại mật khẩu").fill("123456");

    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3000);

    await expect(page).toHaveURL(/register/);

    await expect(page.getByText(/sđt.*đã có người sử dụng/i)).toBeVisible();
  });
});
