// Các hàm nghiệp vụ thuần (pure function) — không đụng DB/HTTP, dễ unit test.
// PHIÊN BẢN BUG (test-fail): giữ nguyên lỗi gốc để minh họa trạng thái RED.

const ORDER_STATUS_TRANSITIONS = {
  pending: ["confirmed", "canceled"],
  confirmed: ["shipping", "canceled"],
  shipping: ["delivered"],
  delivered: [],
  // BUG: canceled là trạng thái kết thúc nhưng vẫn cho chuyển sang delivered
  canceled: ["delivered"],
};

function isValidOrderStatusTransition(currentStatus, newStatus) {
  const allowed = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}

// BUG (FR-10): chỉ chặn khi delivered/canceled, quên chặn shipping
function canCancelOrder(status) {
  return status !== "delivered" && status !== "canceled";
}

// Hàm này bản thân không sai, nhưng KHÔNG được server.js gọi tới ở checkout
// (bug thật nằm ở chỗ checkout dùng thẳng total_amount client gửi, xem server.js)
function calculateCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

module.exports = {
  isValidOrderStatusTransition,
  canCancelOrder,
  calculateCartTotal,
};
