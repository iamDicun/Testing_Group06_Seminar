const request = require("supertest");
const app = require("../server");

// Kịch bản 1 (mức vừa): Hủy đơn hàng khi trạng thái "shipping"
//
// Nghiệp vụ đúng: đơn hàng đã chuyển sang trạng thái "shipping" (đang giao)
// thì KHÔNG được phép hủy nữa.
//
// Bug hiện tại trong server.js (PUT /api/orders/:id/cancel):
//   if (order.status === "delivered" || order.status === "canceled") { ... chặn ... }
// -> chỉ chặn "delivered" và "canceled", quên chặn "shipping".
// Test này viết theo đúng nghiệp vụ nên sẽ FAIL cho tới khi bug được sửa.

describe("Hủy đơn hàng theo trạng thái (Order Cancel)", () => {
  let userToken;
  let adminToken;
  let orderId;

  beforeAll(async () => {
    // 1. Đăng ký user mới để checkout đơn hàng
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

    // 2. Login bằng tài khoản admin có sẵn (seed trong database.js)
    const adminLoginRes = await request(app).post("/api/login").send({
      email: "admin@eshop.com",
      password: "Admin123!",
    });
    adminToken = adminLoginRes.body.token;

    // 3. User checkout tạo đơn hàng mới -> mặc định status = "pending"
    const checkoutRes = await request(app)
      .post("/api/checkout")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ total_amount: 500000, shipping_address: "123 Test Street" });
    orderId = checkoutRes.body.orderId;

    // 4. Admin chuyển trạng thái đơn: pending -> confirmed -> shipping
    await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "confirmed" });

    await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "shipping" });
  });

  test("Không được phép hủy đơn hàng khi đang ở trạng thái 'shipping'", async () => {
    const res = await request(app)
      .put(`/api/orders/${orderId}/cancel`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
  });
});
