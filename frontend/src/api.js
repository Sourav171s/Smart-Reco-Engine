const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  // Shared fetch wrapper keeps frontend/backend errors consistent.
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "API request failed");
  }

  return payload;
}

export const toUiProduct = (product, inventory = null) => ({
  ...product,
  id: product._id || product.id,
  name: product.productName || product.name,
  stock: inventory?.availableQuantity ?? product.stock ?? 0,
  inventoryId: inventory?._id || product.inventoryId,
});

export const toProductPayload = (product) => ({
  productName: product.name?.trim(),
  category: product.category?.trim(),
  brand: product.brand?.trim(),
  price: Number(product.price),
  rating: Number(product.rating || 0),
});

export const api = {
  listProducts: () => request("/products").then((payload) => payload.data || []),
  // Always pass UI-shaped product objects (with `name`) through
  // toProductPayload here, so callers never have to remember to convert
  // `name` -> `productName` etc. themselves before sending it to the API.
  createProduct: (product) =>
    request("/products", { method: "POST", body: JSON.stringify(toProductPayload(product)) }).then((payload) => payload.data),
  updateProduct: (id, product) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(toProductPayload(product)) }).then((payload) => payload.data),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  listInventory: () => request("/inventory").then((payload) => payload.data || []),
  createInventory: (inventory) =>
    request("/inventory", { method: "POST", body: JSON.stringify(inventory) }).then((payload) => payload.data),
  updateInventory: (id, inventory) =>
    request(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(inventory) }).then((payload) => payload.data),

  getRecommendations: (productId) =>
    request(`/recommendations/${productId}`).then((payload) => payload.recommendations || []),

  generateRecommendations: (productId) =>
    request("/recommendations/generate-recommendations", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }).then((payload) => payload.recommendations || []),
  topRecommended: () => request("/analytics/top-recommended").then((payload) => payload.data || []),
};

export { API_BASE_URL };