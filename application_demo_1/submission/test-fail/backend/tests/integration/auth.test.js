const request = require("supertest");
const app = require("../../server");

describe("Auth - Đăng ký & Đăng nhập", () => {
  test("Đăng ký thành công trả về id", async () => {
    const res = await request(app).post("/api/register").send({
      name: "Auth Test User",
      email: "auth-test@test.com",
      password: "Test1234!",
    });
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
  });

  test("Đăng nhập đúng thông tin trả về token", async () => {
    const res = await request(app).post("/api/login").send({
      email: "auth-test@test.com",
      password: "Test1234!",
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test("Đăng nhập sai mật khẩu trả về 401", async () => {
    const res = await request(app).post("/api/login").send({
      email: "auth-test@test.com",
      password: "SaiMatKhau!",
    });
    expect(res.status).toBe(401);
  });

  test("Đăng nhập email không tồn tại trả về 401", async () => {
    const res = await request(app).post("/api/login").send({
      email: "khong-ton-tai@test.com",
      password: "Test1234!",
    });
    expect(res.status).toBe(401);
  });
});
