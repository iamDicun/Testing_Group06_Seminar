const {
  isValidOrderStatusTransition,
  canCancelOrder,
  calculateCartTotal,
} = require("../../businessLogic");

// Unit test thuần: không đụng DB, không đụng HTTP — chỉ gọi trực tiếp hàm.

describe("calculateCartTotal (FR-08)", () => {
  test("tính đúng tổng tiền khi có nhiều sản phẩm", () => {
    const cart = [
      { price: 100000, quantity: 2 },
      { price: 50000, quantity: 1 },
    ];
    expect(calculateCartTotal(cart)).toBe(250000);
  });

  test("giỏ hàng rỗng trả về 0", () => {
    expect(calculateCartTotal([])).toBe(0);
  });
});

describe("canCancelOrder (FR-10)", () => {
  test.each([
    ["pending", true],
    ["confirmed", true],
    ["shipping", false],
    ["delivered", false],
    ["canceled", false],
  ])("status=%s -> canCancel=%s", (status, expected) => {
    expect(canCancelOrder(status)).toBe(expected);
  });
});

describe("isValidOrderStatusTransition (FR-10 - Order State Machine)", () => {
  test.each([
    ["pending", "confirmed", true],
    ["pending", "canceled", true],
    ["pending", "delivered", false],
    ["confirmed", "shipping", true],
    ["confirmed", "canceled", true],
    ["confirmed", "pending", false],
    ["shipping", "delivered", true],
    ["shipping", "canceled", false],
    ["delivered", "pending", false],
    ["delivered", "canceled", false],
    ["canceled", "delivered", false],
    ["canceled", "pending", false],
  ])("%s -> %s hợp lệ? %s", (from, to, expected) => {
    expect(isValidOrderStatusTransition(from, to)).toBe(expected);
  });
});
