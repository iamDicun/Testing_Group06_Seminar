// Các hàm nghiệp vụ thuần (pure function) — không đụng DB/HTTP, dễ unit test.

const ORDER_STATUS_TRANSITIONS = {
  pending: ["confirmed", "canceled"],
  confirmed: ["shipping", "canceled"],
  shipping: ["delivered"],
  delivered: [],
  canceled: [],
};

// FR-10: delivered và canceled là trạng thái kết thúc, không được chuyển tiếp.
function isValidOrderStatusTransition(currentStatus, newStatus) {
  const allowed = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
  return allowed.includes(newStatus);
}

// FR-10: chỉ được hủy đơn khi đang pending hoặc confirmed.
function canCancelOrder(status) {
  return status === "pending" || status === "confirmed";
}

// FR-08: tổng tiền checkout phải tính lại từ giỏ hàng, không nhận từ client.
function calculateCartTotal(cartItems) {
  return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

module.exports = {
  isValidOrderStatusTransition,
  canCancelOrder,
  calculateCartTotal,
};
