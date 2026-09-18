import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PosCartItem } from './types';

export const usePosCartStore = defineStore('posCart', () => {
  const items = ref<PosCartItem[]>([]);

  const count = computed(() => items.value.reduce((s, it) => s + it.qty, 0));

  const totalByCurrency = computed(() => {
    const groups: Record<string, number> = {};
    items.value.forEach((it) => {
      const c = it.currency || 'CUP';
      groups[c] = (groups[c] || 0) + it.price_at_sale * it.qty;
    });
    return groups;
  });

  const currencies = computed(() => Object.keys(totalByCurrency.value).sort());

  function addItem(
    p: { product_id: string; name: string; currency: string; price_at_sale: number; stock_max: number },
    qty = 1,
  ) {
    const found = items.value.find((it) => it.product_id === p.product_id);
    if (found) {
      found.qty = Math.min(found.stock_max, found.qty + qty);
    } else {
      items.value.push({ ...p, qty: Math.min(p.stock_max, qty) });
    }
  }

  function removeItem(product_id: string) {
    items.value = items.value.filter((it) => it.product_id !== product_id);
  }

  function updateQty(product_id: string, qty: number) {
    const it = items.value.find((i) => i.product_id === product_id);
    if (!it) return;
    it.qty = Math.max(1, Math.min(it.stock_max, qty));
  }

  function clearCart() {
    items.value = [];
  }

  return { items, count, totalByCurrency, currencies, addItem, removeItem, updateQty, clearCart };
});