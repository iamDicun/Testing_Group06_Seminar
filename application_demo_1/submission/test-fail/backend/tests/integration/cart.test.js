const request = require("supertest");
const app = require("../../server");

describe("Giỏ hàng (Cart)", () => {
  let token;

  beforeAll(async () => {
    await request(app).post("/api/register").send({
      name: "Cart Test User",
      email: "cart-test@test.com",
      password: "Test1234!",
    });
    const loginRes = await request(app).post("/api/login").send({
      email: "cart-test@test.com",
      password: "Test1234!",
    });
    token = loginRes.body.token;
  });

  test("Giỏ hàng rỗng khi chưa thêm gì", async () => {
    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("Thêm sản phẩm vào giỏ hàng và lấy lại đúng dữ liệu", async () => {
    await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send({ id: 1, name: "iPhone 15 Pro Max", price: 30000000, quantity: 1 });

    const cartRes = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body).toHaveLength(1);
    expect(cartRes.body[0].price).toBe(30000000);
  });

  test("Không có token thì không xem được giỏ hàng", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });
});
