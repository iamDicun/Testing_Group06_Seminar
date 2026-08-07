const request = require("supertest");
const app = require("../../server");

// FR-10: chỉ được hủy đơn khi đang pending/confirmed; shipping trở đi không được tự hủy.

describe("Hủy đơn hàng theo trạng thái (Order Cancel)", () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    await request(app).post("/api/register").send({
      name: "Test Cancel User",
      email: "cancel-user@test.com",
      password: "Test1234!",
    });
    const loginRes = await request(app).post("/api/login").send({
      email: "cancel-user@test.com",
      password: "Test1234!",
    });
    userToken = loginRes.body.token;

    const adminLoginRes = await request(app).post("/api/login").send({
      email: "admin@eshop.com",
      password: "Admin123!",
    });
    adminToken = adminLoginRes.body.token;
  });

  test("Hủy đơn thành công khi đang ở trạng thái pending", async () => {
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ shipping_address: "123 Test Street" });
    const orderId = checkoutRes.body.orderId;

    const cancelRes = await request(app)
      .put(`/api/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(cancelRes.status).toBe(200);
  });

  test("Không được phép hủy đơn hàng khi đang ở trạng thái shipping", async () => {
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ shipping_address: "123 Test Street" });
    const orderId = checkoutRes.body.orderId;

    await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "confirmed" });
    await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipping" });

    const cancelRes = await request(app)
      .put(`/api/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(cancelRes.status).toBe(400);
  });
});
