const request = require("supertest");
const app = require("../../server");

describe("Xem chi tiết đơn hàng (GET /api/orders/:id)", () => {
  let userToken;
  let orderId;

  beforeAll(async () => {
    await request(app).post("/api/register").send({
      name: "Order Detail User",
      email: "order-detail-user@test.com",
      password: "Test1234!",
    });
    const loginRes = await request(app).post("/api/login").send({
      email: "order-detail-user@test.com",
      password: "Test1234!",
    });
    userToken = loginRes.body.token;

    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ shipping_address: "123 Test Street" });
    orderId = checkoutRes.body.orderId;
  });

  test("Lấy đúng thông tin đơn hàng vừa tạo", async () => {
    const res = await request(app).get(`/api/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
    expect(res.body.status).toBe("pending");
  });

  test("Đơn hàng không tồn tại trả về 404", async () => {
    const res = await request(app).get("/api/orders/999999");
    expect(res.status).toBe(404);
  });
});
