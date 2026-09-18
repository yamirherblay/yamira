<template>
  <q-page padding class="admin-page">
    <div class="section-eyebrow">Panel de control</div>
    <div class="section-title">PUNTO DE VENTA</div>
    <div class="section-rule"></div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-7">
        <q-card class="products-card q-mb-md">
          <q-card-section class="row items-center q-col-gutter-sm q-py-sm">
            <div class="col-12 col-sm-6">
              <q-input dense outlined v-model="filter" placeholder="Buscar producto por nombre o categoría..." clearable>
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-select dense outlined v-model="categoryFilter" :options="categories" label="Categoría" clearable />
            </div>
          </q-card-section>
        </q-card>

        <div v-if="loadingProducts" class="text-grey-6 text-center q-py-xl">
          Cargando productos...
        </div>

        <div v-else class="row q-col-gutter-sm">
          <div
            v-for="p in filteredProducts"
            :key="p.id"
            class="col-6 col-sm-4"
          >
            <q-card
              class="pos-card"
              :class="{ 'pos-card--disabled': !hasStock(p) }"
              :clickable="hasStock(p)"
              :ripple="hasStock(p)"
              @click="addToCart(p)"
            >
              <q-img
                :src="p.image || '/images/placeholder.svg'"
                :ratio="4 / 3"
                style="max-height: 110px;"
                loading="lazy"
              />
              <q-card-section class="q-py-sm">
                <div class="pos-name">{{ p.name }}</div>
                <div class="row items-center justify-between q-mt-xs">
                  <span class="pos-price">{{ formatPrice(p.price, p.currency) }}</span>
                  <span v-if="(p.qty_available ?? 0) > 0" class="text-caption text-green-7">
                    {{ p.qty_available }} disp.
                  </span>
                  <q-badge v-else color="red-5" label="Agotado" />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div v-if="!filteredProducts.length" class="col-12 text-grey-6 text-center q-py-xl">
            No hay productos que coincidan.
          </div>
        </div>
      </div>

      <div class="col-12 col-md-5 gt-sm">
        <q-card class="products-card">
          <PosCartPanel v-model:payments="payments" :charging="charging" @submit="checkout" />
        </q-card>
      </div>
    </div>

    <div v-if="$q.screen.lt.md && cart.items.length" class="pos-cobrar-bar">
      <div class="pos-cobrar-bar__info" @click="cartOpen = true" role="button" tabindex="0" @keydown.enter="cartOpen = true">
        <div class="pos-cobrar-bar__count">{{ cart.count }} ítems</div>
        <div class="pos-cobrar-bar__totals">
          <span v-for="c in cart.currencies" :key="c" class="pos-cobrar-bar__total">
            {{ formatPrice(cart.totalByCurrency[c] ?? 0, c) }}
          </span>
        </div>
      </div>
      <q-btn
        color="primary"
        icon="point_of_sale"
        label="Cobrar"
        no-caps
        class="q-ml-sm"
        @click="cartOpen = true"
        style="font-family: 'Nunito Sans', sans-serif; min-height: 44px;"
      />
    </div>

    <q-dialog v-model="cartOpen" position="bottom" :full-width="$q.screen.lt.md">
      <q-card class="pos-sheet">
        <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
          <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
            Carrito y pago
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup aria-label="Cerrar carrito" />
        </q-card-section>
        <q-scroll-area style="height: min(70vh, 520px);">
          <PosCartPanel
            :header="false"
            v-model:payments="payments"
            :charging="charging"
            @submit="onSheetCheckout"
          />
        </q-scroll-area>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useMeta, useQuasar } from 'quasar';

import PosCartPanel from 'src/components/pos/PosCartPanel.vue';
import { supabase } from 'boot/supabase';
import { usePosCartStore } from 'src/stores/posCart';
import { useSales } from 'src/composables/useSales';
import { getAdminBusinessId } from 'src/config/business';
import type { SalePaymentInput } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

useMeta({
  title: 'POS | Admin Y4Y',
  meta: {
    robots: { name: 'robots', content: 'noindex, nofollow' },
  },
});

interface PosProduct {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  category?: string;
  qty_available?: number;
}

const $q = useQuasar();
const cart = usePosCartStore();
const { createSale } = useSales();

const products = ref<PosProduct[]>([]);
const loadingProducts = ref(false);
const filter = ref('');
const categoryFilter = ref<string | null>(null);
const payments = ref<SalePaymentInput[]>([]);
const charging = ref(false);
const cartOpen = ref(false);

const categories = computed(() =>
  Array.from(new Set(products.value.map((p) => p.category).filter(Boolean)))
    .sort() as string[],
);

const filteredProducts = computed(() => {
  const f = filter.value.trim().toLowerCase();
  return products.value.filter((p) => {
    const matchesText =
      !f || p.name.toLowerCase().includes(f) || (p.category || '').toLowerCase().includes(f);
    const matchesCat = !categoryFilter.value || p.category === categoryFilter.value;
    return matchesText && matchesCat;
  });
});

function formatPrice(val?: number | null, currency?: string | null): string {
  if (val == null) return '—';
  return formatPriceUtil(val, currency);
}

function hasStock(p: PosProduct): boolean {
  return (p.qty_available ?? 0) > 0;
}

function addToCart(p: PosProduct) {
  if (!hasStock(p)) return;
  cart.addItem({
    product_id: p.id,
    name: p.name,
    currency: p.currency || 'CUP',
    price_at_sale: p.price,
    stock_max: p.qty_available ?? 0,
  });
}

function onSheetCheckout(recibidos: SalePaymentInput[]) {
  void checkout(recibidos);
}

async function checkout(recibidos?: SalePaymentInput[]) {
  const items = cart.items;
  if (recibidos === undefined) recibidos = payments.value;
  if (!items.length) return;
  const negocioId = getAdminBusinessId();
  if (!negocioId) return;

  charging.value = true;
  try {
    const res = await createSale({
      p_negocio_id: negocioId,
      p_items: items.map((it) => ({
        product_id: it.product_id,
        qty: it.qty,
        price_at_sale: it.price_at_sale,
        currency: it.currency,
        name: it.name,
      })),
      p_payments: recibidos,
    });

    if (res.success) {
      payments.value = [];
      cart.clearCart();
      cartOpen.value = false;
      $q.dialog({
        title: 'Venta registrada',
        message: `Venta #${res.sale_id ?? ''} procesada correctamente.\n\nCUP: ${res.total_cup ?? '—'}\nUSD: ${res.total_usd ?? '—'}`,
        ok: { label: 'Nueva venta', color: 'primary' },
      });
    } else {
      $q.notify({
        message: res.error || 'Error al registrar la venta',
        color: 'negative',
        icon: 'error',
      });
    }
  } finally {
    charging.value = false;
  }
}

async function load() {
  const negocioId = getAdminBusinessId();
  if (!negocioId) return;
  loadingProducts.value = true;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('negocio_id', negocioId)
      .is('deleted_at', null)
      .eq('estado', 'Disponible')
      .order('name', { ascending: true });
    if (error) throw error;
    const list = (data || []) as PosProduct[];

    const ids = list.map((p) => p.id);
    const stockMap: Record<string, number> = {};
    if (ids.length) {
      const { data: stockData, error: stockError } = await supabase
        .from('stock')
        .select('product_id, qty_available')
        .in('product_id', ids);
      if (stockError) throw stockError;
      (stockData || []).forEach((s) => {
        stockMap[s.product_id] = s.qty_available;
      });
    }

    products.value = list.map((p) => ({ ...p, qty_available: stockMap[p.id] ?? 0 }));
  } catch (e) {
    console.error('Error cargando productos del POS:', e);
    $q.notify({
      message: 'Error cargando productos',
      color: 'negative',
      icon: 'error',
    });
  } finally {
    loadingProducts.value = false;
  }
}

onMounted(() => {
  void load();
});
</script>

<style lang="scss">
.admin-page {
  background: #FBF5EE;
  min-height: 100vh;
}

@media (max-width: 1023px) {
  .admin-page {
    padding-bottom: 148px;
  }
}

.pos-cobrar-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(56px + env(safe-area-inset-bottom));
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: #FFFFFF;
  border-top: 2px solid #C98A3D;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.12);

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
    cursor: pointer;
  }

  &__count {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: #6B7280;
  }

  &__totals {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  &__total {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    font-weight: 700;
    color: #62045C;
  }
}

.pos-sheet {
  border-radius: 14px 14px 0 0;
  width: 100%;
  max-width: 100vw !important;
}

.section-eyebrow {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9CA3AF;
  margin-bottom: 2px;
}

.section-title {
  font-family: 'Rubik', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 3px;
  color: #241A24;
  line-height: 1.1;
}

.section-rule {
  height: 1px;
  background: linear-gradient(90deg, #C98A3D 60px, #D9B38C 60px);
  margin: 12px 0 24px 0;
  width: 100%;
}

.products-card {
  border-radius: 4px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.pos-card {
  border-radius: 4px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  margin-bottom: 12px;

  &--disabled {
    opacity: 0.4;
  }

  .pos-name {
    font-family: 'Nunito Sans', sans-serif;
    font-weight: 600;
    font-size: 0.85rem;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pos-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: #62045C;
  }
}
</style>