
export interface BasketItem {
  key: string;
  id: string;
  title: string;
  sku: string;
  image: string;
  url: string;
  currency: string;
  unitPrice: number;
  quantity: number;
  options: Record<string, string>;
}

const STORAGE_KEY = 'vahako-basket-v1';
export const BASKET_CHANGED = 'vahako:basket-changed';
const MAX_QUANTITY = 999;

export function getBasket(): BasketItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is BasketItem =>
      item !== null &&
      typeof item === 'object' &&
      typeof item.key === 'string' &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.unitPrice === 'number' &&
      Number.isFinite(item.unitPrice) &&
      item.unitPrice >= 0 &&
      Number.isInteger(item.quantity) &&
      item.quantity >= 1 &&
      item.quantity <= MAX_QUANTITY &&
      item.options !== null &&
      typeof item.options === 'object' &&
      !Array.isArray(item.options)
    );
  } catch {
    return [];
  }
}

function saveBasket(items: BasketItem[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(BASKET_CHANGED));
    return true;
  } catch {
    return false;
  }
}

export function addToBasket(
  item: Omit<BasketItem, 'key'>,
): boolean {
  if (
    !Number.isInteger(item.quantity) ||
    item.quantity < 1 ||
    item.quantity > MAX_QUANTITY ||
    !Number.isFinite(item.unitPrice) ||
    item.unitPrice < 0
  ) {
    return false;
  }

  const basket = getBasket();

  const key = JSON.stringify([
    item.id,
    Object.entries(item.options).sort(([a], [b]) =>
      a.localeCompare(b)
    ),
  ]);

  const existing = basket.find((entry) => entry.key === key);

  if (existing) {
    existing.quantity = Math.min(
      MAX_QUANTITY,
      existing.quantity + item.quantity
    );
  } else {
    basket.push({ ...item, key });
  }

  return saveBasket(basket);
}

export function removeFromBasket(key: string): boolean {
  return saveBasket(getBasket().filter((item) => item.key !== key));
}

export function updateBasketQuantity(
  key: string,
  quantity: number
): boolean {
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > MAX_QUANTITY) {
    return false;
  }

  if (quantity === 0) return removeFromBasket(key);

  const basket = getBasket();
  const item = basket.find((entry) => entry.key === key);

  if (!item) return false;

  item.quantity = quantity;
  return saveBasket(basket);
}

export function clearBasket(): boolean {
  return saveBasket([]);
}

export function getBasketCount(): number {
  return getBasket().reduce((total, item) => total + item.quantity, 0);
}

export function getBasketTotal(): number {
  return getBasket().reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
}
