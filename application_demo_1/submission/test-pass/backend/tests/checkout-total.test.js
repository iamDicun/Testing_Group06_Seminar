const request = require("supertest");
const app = require("../server");

// Kịch bản 2 (FR-08 — Thanh toán/Checkout):
//
// Đặc tả (README.md - System Requirements Specification):
//   "Backend phải tự tính lại tổng tiền; không chấp nhận giá trị total_amount
//    do client gửi lên."
//
// Bug hiện tại trong server.js (POST /api/checkout):
//   const { total_amount, shipping_address } = req.body;
//   ... lưu thẳng total_amount client gửi vào đơn hàng, không tính lại từ giỏ hàng.
// Test này viết theo đúng đặc tả nên sẽ FAIL cho tới khi bug được sửa.

describe("Thanh toán - Backend phải tự tính lại tổng tiền (Checkout)", () => {
  let userToken;

  beforeAll(async () => {
    // 1. Đăng ký + login user mới
    await request(app).post("/api/register").send({
      name: "Test Checkout User",
      email: "checkout-user@test.com",
      password: "Test1234!",
    });

    const loginRes = await request(app).post("/api/login").send({
      email: "checkout-user@test.com",
      password: "Test1234!",
    });
    userToken = loginRes.body.token;

    // 2. Thêm 1 sản phẩm giá 30,000,000đ vào giỏ hàng
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 30000000,
        quantity: 1,
      });
  });

  test("Checkout phải bỏ qua total_amount client gửi lên, tự tính lại từ giỏ hàng", async () => {
    // Cố tình gửi total_amount sai lệch (1 đồng) trong khi giỏ hàng thực tế là 30,000,000đ
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ total_amount: 1, shipping_address: "123 Test Street" });

    const orderId = checkoutRes.body.orderId;
    const orderRes = await request(app).get(`/api/orders/${orderId}`);

    expect(orderRes.body.total_amount).toBe(30000000);
  });
});
