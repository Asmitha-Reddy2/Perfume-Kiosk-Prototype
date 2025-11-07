// This is a simple in-memory "database" for the prototype.
// In production, this would be a real database (e.g., PostgreSQL, MongoDB).

const db = new Map();

export const createOrder = (order) => {
  console.log(`[DB] Creating order: ${order.id}`);
  db.set(order.id, order);
  return order;
};

export const getOrder = (id) => {
  return db.get(id);
};

export const updateOrder = (id, updates) => {
  if (!db.has(id)) return null;
  const order = db.get(id);
  const updatedOrder = { ...order, ...updates };
  db.set(id, updatedOrder);
  console.log(`[DB] Updating order ${id}: Status -> ${updatedOrder.status}`);
  return updatedOrder;
};

// Helper to find order by its Razorpay Payment Link ID
export const findOrderByPaymentLinkId = (paymentLinkId) => {
  for (const order of db.values()) {
    if (order.paymentLinkId === paymentLinkId) {
      return order;
    }
  }
  return null;
};