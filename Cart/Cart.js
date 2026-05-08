const CART_STORAGE_KEY = "ecom_cart_items_v1";
const SAVED_STORAGE_KEY = "ecom_saved_items_v1";
const FALLBACK_IMAGE = "assets/product-placeholder.svg";

const DEFAULT_CART_ITEMS = [
  {
    id: "apple-juice",
    name: "Apple Juice",
    size: "250ml",
    price: 2.99,
    quantity: 1,
    image:
      "https://i1-c.pinimg.com/1200x/30/b8/ec/30b8ec08dc6917c4cd7cbd73e127aa31.jpg",
  },
  {
    id: "grapes-juice",
    name: "Grapes Juice",
    size: "250ml",
    price: 3.19,
    quantity: 1,
    image:
      "https://i1-c.pinimg.com/1200x/c2/19/f5/c219f5c5c8f00a1b5d0d5e046e3c79d9.jpg",
  },
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const normalizeItem = (rawItem, index) => {
  const safeId =
    typeof rawItem?.id === "string" && rawItem.id.trim()
      ? rawItem.id
      : `item-${index + 1}`;
  const safeName =
    typeof rawItem?.name === "string" && rawItem.name.trim()
      ? rawItem.name
      : "Product";
  const safeSize =
    typeof rawItem?.size === "string" && rawItem.size.trim()
      ? rawItem.size
      : "Standard";
  const safePrice = Number(rawItem?.price);
  const safeQuantity = Number(rawItem?.quantity);
  const safeImage =
    typeof rawItem?.image === "string" && rawItem.image.trim()
      ? rawItem.image
      : FALLBACK_IMAGE;

  return {
    id: safeId,
    name: safeName,
    size: safeSize,
    price: Number.isFinite(safePrice) && safePrice >= 0 ? safePrice : 0,
    quantity:
      Number.isFinite(safeQuantity) && safeQuantity > 0
        ? Math.floor(safeQuantity)
        : 1,
    image: safeImage,
  };
};

const mergeItemsById = (items) => {
  const itemMap = new Map();

  items.forEach((item) => {
    const existing = itemMap.get(item.id);
    if (existing) {
      existing.quantity += item.quantity;
      return;
    }
    itemMap.set(item.id, { ...item });
  });

  return Array.from(itemMap.values());
};

const normalizeList = (items) => {
  const normalized = items.map(normalizeItem);
  return mergeItemsById(normalized);
};

const loadItems = (storageKey, fallbackItems = []) => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      return normalizeList(fallbackItems);
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return normalizeList(fallbackItems);
    }

    if (parsed.length === 0 && fallbackItems.length > 0) {
      return normalizeList(fallbackItems);
    }

    return normalizeList(parsed);
  } catch (_error) {
    return normalizeList(fallbackItems);
  }
};

const saveItems = (storageKey, items) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(items));
  } catch (_error) {
    // Ignore storage failures and keep UI responsive.
  }
};

const addOrMergeItem = (targetList, item) => {
  const existingItem = targetList.find((entry) => entry.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity;
    return;
  }
  targetList.push({ ...item });
};

const cartItems = loadItems(CART_STORAGE_KEY, DEFAULT_CART_ITEMS);
const savedItems = loadItems(SAVED_STORAGE_KEY);

const cartItemsEl = document.getElementById("cartItems");
const savedSectionEl = document.getElementById("savedSection");
const savedItemsListEl = document.getElementById("savedItemsList");
const subtotalPriceEl = document.getElementById("subtotalPrice");
const itemCountEl = document.getElementById("itemCount");
const removeAllBtnEl = document.getElementById("removeAllBtn");
const checkoutBtnEl = document.getElementById("checkoutBtn");

if (
  !cartItemsEl ||
  !savedSectionEl ||
  !savedItemsListEl ||
  !subtotalPriceEl ||
  !itemCountEl ||
  !removeAllBtnEl ||
  !checkoutBtnEl
) {
  throw new Error("Cart page elements are missing.");
}

const syncStorage = () => {
  saveItems(CART_STORAGE_KEY, cartItems);
  saveItems(SAVED_STORAGE_KEY, savedItems);
};

const updateSummary = () => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  itemCountEl.textContent = `${totalItems} ${totalItems === 1 ? "item" : "items"}`;
  subtotalPriceEl.textContent = formatter.format(subtotal);

  const isCartEmpty = cartItems.length === 0;
  removeAllBtnEl.disabled = isCartEmpty;
  removeAllBtnEl.style.visibility = isCartEmpty ? "hidden" : "visible";
  checkoutBtnEl.disabled = isCartEmpty;
};

const cartItemTemplate = (item) => {
  return `
    <article class="cart-item" data-id="${item.id}">
      <img class="item-image" src="${item.image}" alt="${item.name}" />

      <div class="item-info">
        <h3>${item.name}</h3>
        <p class="item-meta">${item.size}</p>
        <span class="item-badge" aria-hidden="true"></span>
      </div>

      <div class="qty-controls" aria-label="Quantity controls for ${item.name}">
        <button class="qty-btn" type="button" data-action="increase">+</button>
        <span class="qty-value">${item.quantity}</span>
        <button class="qty-btn" type="button" data-action="decrease">-</button>
      </div>

      <div class="item-side">
        <p class="item-price">${formatter.format(item.price)}</p>
        <div class="item-actions">
          <button class="action-btn" type="button" data-action="save">
            Save for later
          </button>
          <button class="action-btn remove" type="button" data-action="remove">
            Remove
          </button>
        </div>
      </div>
    </article>
  `;
};

const savedItemTemplate = (item) => {
  return `
    <div class="saved-pill" data-id="${item.id}">
      <span>${item.name} (${item.quantity})</span>
      <button type="button" data-action="move-to-cart">Move to cart</button>
      <button type="button" data-action="delete-saved">x</button>
    </div>
  `;
};

const renderSavedItems = () => {
  if (savedItems.length === 0) {
    savedSectionEl.classList.add("is-hidden");
    savedItemsListEl.innerHTML = "";
    return;
  }

  savedSectionEl.classList.remove("is-hidden");
  savedItemsListEl.innerHTML = savedItems.map(savedItemTemplate).join("");
};

const renderCartItems = () => {
  if (cartItems.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="empty-state">
        Your cart is empty. Add products and they will show here.
      </div>
    `;
    updateSummary();
    return;
  }

  cartItemsEl.innerHTML = cartItems.map(cartItemTemplate).join("");
  updateSummary();
};

const render = () => {
  renderCartItems();
  renderSavedItems();
};

const commit = () => {
  syncStorage();
  render();
};

const removeItem = (id) => {
  const index = cartItems.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }
  cartItems.splice(index, 1);
  commit();
};

const saveForLater = (id) => {
  const index = cartItems.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const [item] = cartItems.splice(index, 1);
  addOrMergeItem(savedItems, item);
  commit();
};

const moveToCart = (id) => {
  const index = savedItems.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  const [item] = savedItems.splice(index, 1);
  addOrMergeItem(cartItems, item);
  commit();
};

const deleteSavedItem = (id) => {
  const index = savedItems.findIndex((item) => item.id === id);
  if (index < 0) {
    return;
  }

  savedItems.splice(index, 1);
  commit();
};

const changeQuantity = (id, delta) => {
  const item = cartItems.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  const nextQuantity = item.quantity + delta;
  if (nextQuantity < 1) {
    return;
  }

  item.quantity = nextQuantity;
  commit();
};

cartItemsEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const cartItemEl = button.closest(".cart-item");
  if (!cartItemEl) {
    return;
  }

  const itemId = cartItemEl.dataset.id;
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(itemId, 1);
  } else if (action === "decrease") {
    changeQuantity(itemId, -1);
  } else if (action === "remove") {
    removeItem(itemId);
  } else if (action === "save") {
    saveForLater(itemId);
  }
});

savedItemsListEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }

  const pillEl = button.closest(".saved-pill");
  if (!pillEl) {
    return;
  }

  const itemId = pillEl.dataset.id;
  const action = button.dataset.action;

  if (action === "move-to-cart") {
    moveToCart(itemId);
  } else if (action === "delete-saved") {
    deleteSavedItem(itemId);
  }
});

removeAllBtnEl.addEventListener("click", () => {
  if (cartItems.length === 0) {
    return;
  }

  cartItems.length = 0;
  commit();
});

checkoutBtnEl.addEventListener("click", () => {
  if (cartItems.length === 0) {
    return;
  }

  alert("Checkout started. Connect this button to your payment flow.");
});

syncStorage();
render();
