const request = require("supertest");
const app = require("../../server");

// FR-10: Order State Machine — admin cập nhật trạng thái đơn hàng.

describe("Admin cập nhật trạng thái đơn hàng (Order State Machine)", () => {
  let userToken;
  let adminToken;
  let orderId;

  beforeAll(async () => {
    await request(app).post("/api/register").send({
      name: "Order Status User",
      email: "order-status-user@test.com",
      password: "Test1234!",
    });
    const loginRes = await request(app).post("/api/login").send({
      email: "order-status-user@test.com",
      password: "Test1234!",
    });
    userToken = loginRes.body.token;

    const adminLoginRes = await request(app).post("/api/login").send({
      email: "admin@eshop.com",
      password: "Admin123!",
    });
    adminToken = adminLoginRes.body.token;

    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ shipping_address: "123 Test Street" });
    orderId = checkoutRes.body.orderId;
  });

  test("Chuyển pending -> confirmed hợp lệ", async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "confirmed" });
    expect(res.status).toBe(200);
  });

  test("Chuyển confirmed -> delivered KHÔNG hợp lệ (phải qua shipping trước)", async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "delivered" });
    expect(res.status).toBe(400);
  });

  test("Chuyển confirmed -> shipping hợp lệ", async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipping" });
    expect(res.status).toBe(200);
  });

  test("Chuyển shipping -> delivered hợp lệ", async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "delivered" });
    expect(res.status).toBe(200);
  });

  test("delivered là trạng thái kết thúc, không được chuyển tiếp", async () => {
    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "canceled" });
    expect(res.status).toBe(400);
  });
});
