const request = require("supertest");
const app = require("../server");

// Kịch bản 2 (mức dễ): Kiểu dữ liệu "price" bị sai khi id sản phẩm là số chẵn
//
// Nghiệp vụ đúng: field "price" luôn phải là kiểu number.
//
// Bug hiện tại trong server.js (GET /api/products/:id):
//   if (row.id % 2 === 0) row.price = row.price.toString();
// -> sản phẩm có id chẵn (ví dụ id=2) bị ép price thành string.
// Test này sẽ FAIL cho tới khi bug được sửa.

describe("Kiểu dữ liệu price của sản phẩm (Product price type)", () => {
  test("GET /api/products/:id trả về price dạng number ngay cả khi id là số chẵn", async () => {
    // id = 2 (Samsung Galaxy S24 Ultra) được seed sẵn trong database.js
    const res = await request(app).get("/api/products/2");

    expect(res.status).toBe(200);
    expect(typeof res.body.price).toBe("number");
  });
});
