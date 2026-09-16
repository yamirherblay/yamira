<template>
  <q-page padding class="admin-page">
    <div class="section-eyebrow">Panel de control</div>
    <div class="section-title">INVENTARIO</div>
    <div class="section-rule"></div>

    <q-tabs
      v-model="tab"
      dense
      class="text-grey-7 q-mb-md"
      active-color="primary"
      indicator-color="primary"
      narrow-indicator
    >
      <q-tab name="inventory" label="Inventario" no-caps />
      <q-tab name="moves" label="Movimientos" no-caps />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <q-tab-panel name="inventory" class="q-pa-none">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6 col-sm-3">
            <q-card
              class="stat-gauge"
              :class="{ 'gauge-active': stockFilter === 'all' }"
              style="border-left: 4px solid #62045C;"
              clickable
              @click="setStockFilter('all')"
            >
              <q-card-section class="row items-center no-wrap q-py-md">
                <div class="gauge-icon" style="background: #62045C;">
                  <q-icon name="inventory_2" size="22px" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="gauge-label">PRODUCTOS</div>
                  <div class="gauge-value" style="color: #62045C;">{{ store.totalProducts }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-6 col-sm-3">
            <q-card
              class="stat-gauge"
              :class="{ 'gauge-active': stockFilter === 'bajo' }"
              style="border-left: 4px solid #C98A3D;"
              clickable
              @click="setStockFilter('bajo')"
            >
              <q-card-section class="row items-center no-wrap q-py-md">
                <div class="gauge-icon" style="background: #C98A3D;">
                  <q-icon name="warning" size="22px" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="gauge-label">STOCK BAJO</div>
                  <div class="gauge-value" style="color: #C98A3D;">{{ store.lowStockCount }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-6 col-sm-3">
            <q-card
              class="stat-gauge"
              :class="{ 'gauge-active': stockFilter === 'danados' }"
              style="border-left: 4px solid #E8543F;"
              clickable
              @click="setStockFilter('danados')"
            >
              <q-card-section class="row items-center no-wrap q-py-md">
                <div class="gauge-icon" style="background: #E8543F;">
                  <q-icon name="report" size="22px" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="gauge-label">DAÑADOS</div>
                  <div class="gauge-value" style="color: #E8543F;">{{ store.damagedCount }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-6 col-sm-3">
            <q-card
              class="stat-gauge"
              :class="{ 'gauge-active': stockFilter === 'agotados' }"
              style="border-left: 4px solid #9CA3AF;"
              clickable
              @click="setStockFilter('agotados')"
            >
              <q-card-section class="row items-center no-wrap q-py-md">
                <div class="gauge-icon" style="background: #9CA3AF;">
                  <q-icon name="block" size="22px" color="white" />
                </div>
                <div class="q-ml-md">
                  <div class="gauge-label">AGOTADOS</div>
                  <div class="gauge-value" style="color: #9CA3AF;">{{ store.outOfStockCount }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card class="products-card">
          <q-card-section class="row items-center q-col-gutter-sm q-py-sm">
            <div class="col-auto">
              <div class="row items-center no-wrap q-gutter-sm">
                <q-btn
                  color="primary"
                  icon="refresh"
                  label="Refrescar"
                  no-caps
                  :loading="store.loading"
                  @click="refresh"
                  style="font-family: 'Nunito Sans', sans-serif;"
                />
                <q-btn
                  color="secondary"
                  icon="tune"
                  label="Ajuste"
                  no-caps
                  @click="ajusteDialogOpen = true"
                  style="font-family: 'Nunito Sans', sans-serif;"
                />
              </div>
            </div>
            <div class="col-12 col-sm-4 q-ml-auto">
              <q-input
                dense
                outlined
                v-model="filter"
                placeholder="Buscar productos..."
                clearable
              >
                <template #prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </q-card-section>

          <q-separator />

          <q-table
            :rows="filteredProducts"
            :columns="columns"
            flat
            :header-cell-style="headerCellStyle"
            loading-label="Cargando inventario..."
            no-data-label="No hay productos registrados."
            row-key="id"
            :pagination="{ rowsPerPage: 10 }"
            class="products-table"
          >
            <template #body-cell-image="props">
              <q-td :props="props">
                <q-img
                  :src="props.row.image"
                  :ratio="1"
                  style="width: 36px; height: 36px; border-radius: 2px;"
                />
              </q-td>
            </template>

            <template #body-cell-price="props">
              <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
                {{ formatPrice(props.row.price, props.row.currency) }}
              </q-td>
            </template>

            <template #body-cell-cost_price="props">
              <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
                {{ props.row.cost_price != null ? formatPrice(props.row.cost_price, props.row.currency) : '—' }}
              </q-td>
            </template>

            <template #body-cell-qty_available="props">
              <q-td :props="props">
                <span
                  :class="{
                    'text-red-7 text-weight-bold': (props.row.stock?.qty_available ?? 0) === 0,
                    'text-orange-8': (props.row.stock?.qty_available ?? 0) > 0 && (props.row.stock?.qty_available ?? 0) <= 5,
                  }"
                  style="font-family: 'JetBrains Mono', monospace;"
                >
                  {{ props.row.stock?.qty_available ?? '—' }}
                </span>
              </q-td>
            </template>

            <template #body-cell-qty_damaged="props">
              <q-td :props="props">
                <span
                  v-if="(props.row.stock?.qty_damaged ?? 0) > 0"
                  class="text-red-5"
                  style="font-family: 'JetBrains Mono', monospace;"
                >
                  {{ props.row.stock.qty_damaged }}
                </span>
                <span v-else style="font-family: 'JetBrains Mono', monospace; color: #9CA3AF;">0</span>
              </q-td>
            </template>

            <template #body-cell-estado="props">
              <q-td :props="props">
                <q-badge
                  :label="props.row.estado"
                  :color="props.row.estado === 'Disponible' ? 'green-7' : 'red-5'"
                  dense
                  style="font-family: 'Nunito Sans', sans-serif; font-weight: 500; padding: 2px 8px;"
                />
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props">
                <div class="row items-center no-wrap q-gutter-xs" style="justify-content: flex-end;">
                  <q-btn
                    size="sm"
                    flat
                    round
                    color="green-7"
                    icon="add_circle"
                    @click="openDialog(props.row, 'entrada')"
                  >
                    <q-tooltip>Entrada</q-tooltip>
                  </q-btn>
                  <q-btn
                    size="sm"
                    flat
                    round
                    color="orange-8"
                    icon="remove_circle"
                    @click="openDialog(props.row, 'salida')"
                  >
                    <q-tooltip>Salida</q-tooltip>
                  </q-btn>
                  <q-btn
                    size="sm"
                    flat
                    round
                    color="red-5"
                    icon="warning"
                    @click="openDialog(props.row, 'dano')"
                  >
                    <q-tooltip>Daño</q-tooltip>
                  </q-btn>
                  <q-btn
                    size="sm"
                    flat
                    round
                    color="blue-7"
                    icon="replay"
                    @click="openDialog(props.row, 'devolucion')"
                  >
                    <q-tooltip>Devolución</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="moves" class="q-pa-none">
        <q-card class="products-card">
          <q-card-section class="row items-center q-col-gutter-sm q-py-sm">
            <div class="col-auto">
              <q-btn
                color="primary"
                icon="refresh"
                label="Refrescar"
                no-caps
                :loading="store.movesLoading"
                @click="store.fetchMoves()"
                style="font-family: 'Nunito Sans', sans-serif;"
              />
            </div>
          </q-card-section>

          <q-separator />

          <q-table
            :rows="store.moves"
            :columns="moveColumns"
            flat
            :header-cell-style="headerCellStyle"
            loading-label="Cargando movimientos..."
            no-data-label="No hay movimientos registrados."
            row-key="id"
            :pagination="{ rowsPerPage: 15 }"
            class="products-table"
          >
            <template #body-cell-created_at="props">
              <q-td :props="props">
                <span class="text-caption">{{ formatDate(props.row.created_at) }}</span>
              </q-td>
            </template>

            <template #body-cell-product="props">
              <q-td :props="props">
                <div class="row items-center no-wrap q-gutter-xs">
                  <q-img
                    v-if="props.row.products?.image"
                    :src="props.row.products.image"
                    style="width: 24px; height: 24px; border-radius: 2px;"
                  />
                  <span>{{ props.row.products?.name ?? props.row.product_id }}</span>
                </div>
              </q-td>
            </template>

            <template #body-cell-type="props">
              <q-td :props="props">
                <q-badge
                  :label="moveTypeLabel(props.row.type)"
                  :color="moveTypeColor(props.row.type)"
                  dense
                  style="font-family: 'Nunito Sans', sans-serif; padding: 2px 8px;"
                />
              </q-td>
            </template>

            <template #body-cell-qty="props">
              <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
                {{ props.row.qty }}
              </q-td>
            </template>

            <template #body-cell-user_id="props">
              <q-td :props="props">
                <span
                  class="text-caption text-grey-7"
                  :title="props.row.user_id"
                >
                  {{ userDisplay(props.row.user_id) }}
                </span>
              </q-td>
            </template>

            <template #body-cell-note="props">
              <q-td :props="props">
                <span class="text-caption text-grey-7">{{ props.row.note || '—' }}</span>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="ajusteDialogOpen">
      <q-card style="max-width: 460px; width: 100%;">
        <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
          <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
            Ajustar inventario
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-select
            v-model="ajusteProduct"
            :options="ajusteOptions"
            use-input
            input-debounce="300"
            @filter="filterAjusteOptions"
            label="Buscar producto..."
            outlined
            dense
            clearable
            behavior="menu"
            option-label="name"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps" style="display: flex; align-items: center; gap: 10px;">
                <q-img
                  v-if="scope.opt.image"
                  :src="scope.opt.image"
                  style="width: 30px; height: 30px; border-radius: 2px; flex-shrink: 0;"
                />
                <div>
                  <div class="text-body2">{{ scope.opt.name }}</div>
                  <div class="text-caption text-grey-7">
                    Disponible: {{ scope.opt.stock?.qty_available ?? '—' }}
                  </div>
                </div>
              </q-item>
            </template>
          </q-select>

          <div class="row justify-end q-mt-md">
            <q-btn flat label="Cancelar" color="grey-7" @click="ajusteDialogOpen = false" />
            <q-btn
              label="Continuar"
              color="primary"
              no-caps
              :disable="!ajusteProduct"
              @click="onAjusteProductSelected"
              style="font-family: 'Nunito Sans', sans-serif;"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <StockMoveDialog
      v-model="dialogOpen"
      :product="dialogProduct"
      :type="dialogType"
      @submitted="onMoveSubmitted"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useMeta, useQuasar } from 'quasar';

import StockMoveDialog from 'src/components/StockMoveDialog.vue';
import { useInventoryStore } from 'src/stores/inventory';
import { useAuthStore } from 'src/stores/auth';
import type { InventoryProduct, StockMoveType } from 'src/stores/types';
import { formatPrice as _formatPrice } from 'src/utils/format';

useMeta({
  title: 'Inventario | Admin Y4Y',
  meta: {
    robots: { name: 'robots', content: 'noindex, nofollow' },
  },
});

const store = useInventoryStore();
const auth = useAuthStore();
const $q = useQuasar();
const tab = ref('inventory');
const filter = ref('');
const stockFilter = ref<'all' | 'bajo' | 'danados' | 'agotados'>('all');

const dialogOpen = ref(false);
const dialogProduct = ref<InventoryProduct | null>(null);
const dialogType = ref<StockMoveType>('entrada');

const ajusteDialogOpen = ref(false);
const ajusteProduct = ref<InventoryProduct | null>(null);
const ajusteOptions = ref<InventoryProduct[]>([]);

const headerCellStyle = () => ({
  background: '#62045C',
  color: '#FFFFFF',
  fontFamily: 'Nunito Sans, sans-serif',
  fontWeight: 600,
  fontSize: '0.75rem',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
});

const columns: QTableColumn[] = [
  { name: 'image', label: '', field: 'image', align: 'left', style: 'width: 48px' },
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  { name: 'price', label: 'Precio', field: 'price', align: 'right', sortable: true },
  { name: 'cost_price', label: 'Costo', field: 'cost_price', align: 'right', sortable: true },
  { name: 'qty_available', label: 'Disponible', field: (row: InventoryProduct) => row.stock?.qty_available ?? 0, align: 'center', sortable: true },
  { name: 'qty_damaged', label: 'Dañado', field: (row: InventoryProduct) => row.stock?.qty_damaged ?? 0, align: 'center', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];

const moveColumns: QTableColumn[] = [
  { name: 'created_at', label: 'Fecha', field: 'created_at', align: 'left', sortable: true },
  { name: 'product', label: 'Producto', field: (row: { products?: { name?: string } | null }) => row.products?.name ?? '', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center', sortable: true },
  { name: 'qty', label: 'Cantidad', field: 'qty', align: 'center', sortable: true },
  { name: 'user_id', label: 'Usuario', field: 'user_id', align: 'left' },
  { name: 'note', label: 'Nota', field: 'note', align: 'left' },
];

const filteredProducts = computed(() => {
  const f = filter.value.trim().toLowerCase();
  let list = store.products;
  if (f) {
    list = list.filter(
      (p) =>
        p.name?.toLowerCase().includes(f) ||
        p.id?.toLowerCase().includes(f) ||
        p.category?.toLowerCase().includes(f),
    );
  }

  if (stockFilter.value === 'bajo') {
    list = list.filter(
      (p) => (p.stock?.qty_available ?? 0) > 0 && (p.stock?.qty_available ?? 0) <= 5,
    );
  } else if (stockFilter.value === 'danados') {
    list = list.filter((p) => (p.stock?.qty_damaged ?? 0) > 0);
  } else if (stockFilter.value === 'agotados') {
    list = list.filter((p) => (p.stock?.qty_available ?? 0) === 0);
  }

  return list;
});

function setStockFilter(value: 'all' | 'bajo' | 'danados' | 'agotados') {
  stockFilter.value = stockFilter.value === value ? 'all' : value;
}

function formatPrice(val?: number | null, currency?: string | null): string {
  if (val == null) return '—';
  return _formatPrice(val, currency);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function shortId(id: string): string {
  return id ? id.slice(0, 8) : '—';
}

function userDisplay(userId: string): string {
  if (auth.user?.id === userId && auth.user.email) return auth.user.email;
  return shortId(userId);
}

function moveTypeLabel(type: StockMoveType): string {
  const labels: Record<StockMoveType, string> = {
    entrada: 'Entrada',
    salida: 'Salida',
    devolucion: 'Devolución',
    ajuste: 'Ajuste',
    dano: 'Daño',
  };
  return labels[type] ?? type;
}

function moveTypeColor(type: StockMoveType): string {
  const colors: Record<StockMoveType, string> = {
    entrada: 'green-7',
    salida: 'orange-8',
    devolucion: 'blue-7',
    ajuste: 'primary',
    dano: 'red-5',
  };
  return colors[type] ?? 'grey-7';
}

function openDialog(product: InventoryProduct, type: StockMoveType) {
  dialogProduct.value = product;
  dialogType.value = type;
  dialogOpen.value = true;
}

function filterAjusteOptions(val: string, update: (callback: () => void) => void) {
  if (val === '') {
    update(() => {
      ajusteOptions.value = store.products.slice(0, 20);
    });
    return;
  }
  update(() => {
    const f = val.toLowerCase();
    ajusteOptions.value = store.products
      .filter((p) => p.name?.toLowerCase().includes(f))
      .slice(0, 20);
  });
}

function onAjusteProductSelected() {
  if (!ajusteProduct.value) return;
  ajusteDialogOpen.value = false;
  openDialog(ajusteProduct.value, 'ajuste');
  ajusteProduct.value = null;
}

function onMoveSubmitted() {
  const labels: Record<StockMoveType, string> = {
    entrada: 'Entrada registrada',
    salida: 'Salida registrada',
    devolucion: 'Devolución registrada',
    ajuste: 'Ajuste aplicado',
    dano: 'Daño registrado',
  };
  $q.notify({
    message: labels[dialogType.value],
    color: 'positive',
    icon: 'check_circle',
    timeout: 2000,
  });
}

function refresh() {
  void store.fetchInventory();
  void store.fetchMoves();
}

onMounted(() => {
  void store.fetchInventory();
  void store.fetchMoves();
});
</script>

<style lang="scss">
.gauge-active {
  box-shadow: 0 0 0 2px #C98A3D inset !important;
  background: #F5EDE2 !important;
}
</style>
