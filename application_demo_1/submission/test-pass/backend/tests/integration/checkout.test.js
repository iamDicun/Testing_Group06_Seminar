const request = require("supertest");
const app = require("../../server");

// FR-08: Backend phải tự tính lại tổng tiền, không nhận total_amount từ client.

describe("Thanh toán (Checkout)", () => {
  let userToken;

  beforeAll(async () => {
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
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ total_amount: 1, shipping_address: "123 Test Street" });

    const orderId = checkoutRes.body.orderId;
    const orderRes = await request(app).get(`/api/orders/${orderId}`);

    expect(orderRes.body.total_amount).toBe(30000000);
  });

  test("Không đăng nhập thì không checkout được", async () => {
    const res = await request(app)
      .post("/api/checkout")
      .send({ shipping_address: "123 Test Street" });
    expect(res.status).toBe(401);
  });
});
