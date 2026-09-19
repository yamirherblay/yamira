<template>
  <q-page padding class="admin-page">
    <div class="section-eyebrow">Panel de control</div>
    <div class="section-title">VENTAS</div>
    <div class="section-rule"></div>

    <q-card class="products-card">
      <q-card-section class="row items-center q-col-gutter-sm q-py-sm">
        <div class="col-auto">
          <q-btn
            color="primary"
            icon="refresh"
            label="Refrescar"
            no-caps
            :loading="loading"
            @click="load"
            style="font-family: 'Nunito Sans', sans-serif;"
          />
        </div>
        <div class="col-auto">
          <q-btn
            color="secondary"
            icon="point_of_sale"
            label="Nueva Venta"
            no-caps
            @click="router.push({ name: 'admin-pos' })"
            style="font-family: 'Nunito Sans', sans-serif;"
          />
        </div>
        <div class="col-12 col-sm-4 q-ml-auto">
          <q-input dense outlined v-model="filter" placeholder="Buscar por ID o token..." clearable>
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        :rows="filteredSales"
        :columns="columns"
        flat
        :header-cell-style="headerCellStyle"
        loading-label="Cargando ventas..."
        no-data-label="No hay ventas registradas."
        row-key="id"
        :pagination="{ rowsPerPage: 20 }"
        :visible-columns="visibleColumns"
        :row-class="() => (isMobile ? 'cursor-pointer' : '')"
        class="products-table"
        @row-click="onRowClick"
      >
        <template #body-cell-id="props">
          <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
            #{{ props.row.id }}
          </q-td>
        </template>

        <template #body-cell-created_at="props">
          <q-td :props="props">
            <span class="text-caption">{{ formatDate(props.row.created_at) }}</span>
          </q-td>
        </template>

        <template #body-cell-type="props">
          <q-td :props="props">
            <q-badge
              :label="saleTypeLabel(props.row)"
              :color="saleTypeColor(props.row)"
              dense
              style="font-family: 'Nunito Sans', sans-serif; padding: 2px 8px;"
            />
          </q-td>
        </template>

        <template #body-cell-total_cup="props">
          <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
            {{ formatPrice(props.row.total_cup, 'CUP') }}
          </q-td>
        </template>

        <template #body-cell-total_usd="props">
          <q-td :props="props" style="font-family: 'JetBrains Mono', monospace;">
            {{ props.row.total_usd ? formatPrice(props.row.total_usd, 'USD') : '—' }}
          </q-td>
        </template>

        <template #body-cell-payments="props">
          <q-td :props="props">
            <div class="text-caption">{{ paymentsSummary(props.row.id) }}</div>
          </q-td>
        </template>

        <template #body-cell-total_items="props">
          <q-td :props="props">
            <span style="font-family: 'JetBrains Mono', monospace;">{{ totalItems(props.row.id) }}</span>
          </q-td>
        </template>

        <template #body-cell-totales="props">
          <q-td :props="props">
            <div class="column items-end">
              <span style="font-family: 'JetBrains Mono', monospace;">{{ formatPrice(props.row.total_cup, 'CUP') }}</span>
              <span
                v-if="props.row.total_usd"
                class="text-caption"
                style="font-family: 'JetBrains Mono', monospace;"
              >
                {{ formatPrice(props.row.total_usd, 'USD') }}
              </span>
            </div>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props">
            <div class="row items-center no-wrap q-gutter-xs" style="justify-content: flex-end;">
              <q-btn size="sm" flat round color="primary" icon="visibility" aria-label="Ver detalle" @click.stop="openDetail(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn size="sm" flat round color="negative" icon="block" aria-label="Anular" @click.stop="openAnular(props.row)">
                <q-tooltip>Anular</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <DialogDetalleVenta v-model="detailOpen" :sale="detailSale" />

    <q-dialog v-model="anularOpen">
      <q-card style="max-width: 420px; width: 100%;">
        <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #E8543F;">
          <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
            Anular venta #{{ anularSale?.id }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input
            v-model="anularNote"
            label="¿Por qué se anula? (obligatoria)"
            outlined
            dense
            type="textarea"
            rows="2"
          />
          <div v-if="anularError" class="text-negative text-caption q-mt-sm">{{ anularError }}</div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="anularOpen = false" />
          <q-btn
            label="Confirmar anulación"
            color="negative"
            no-caps
            :loading="anularLoading"
            :disable="!anularNote.trim()"
            @click="confirmAnular"
            style="font-family: 'Nunito Sans', sans-serif;"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { QTableColumn } from 'quasar';
import { useMeta, useQuasar } from 'quasar';

import DialogDetalleVenta from 'src/components/ventas/DialogDetalleVenta.vue';
import { supabase } from 'boot/supabase';
import { useSales } from 'src/composables/useSales';
import { getAdminBusinessId } from 'src/config/business';
import type { Sale, SalePaymentRow, SaleProductRow } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

useMeta({
  title: 'Ventas | Admin Y4Y',
  meta: {
    robots: { name: 'robots', content: 'noindex, nofollow' },
  },
});

const $q = useQuasar();
const router = useRouter();
const { anularVenta } = useSales();

const sales = ref<Sale[]>([]);
const payments = ref<SalePaymentRow[]>([]);
const products = ref<SaleProductRow[]>([]);
const loading = ref(false);
const filter = ref('');

const detailOpen = ref(false);
const detailSale = ref<Sale | null>(null);

const anularOpen = ref(false);
const anularSale = ref<Sale | null>(null);
const anularNote = ref('');
const anularLoading = ref(false);
const anularError = ref('');

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
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'created_at', label: 'Fecha', field: 'created_at', align: 'left', sortable: true },
  { name: 'type', label: 'Tipo', field: 'type', align: 'center' },
  { name: 'total_cup', label: 'Total CUP', field: 'total_cup', align: 'right', sortable: true },
  { name: 'total_usd', label: 'Total USD', field: 'total_usd', align: 'right', sortable: true },
  { name: 'payments', label: 'Métodos de pago', field: 'payments', align: 'left' },
  { name: 'total_items', label: 'Items', field: 'total_items', align: 'center' },
  { name: 'totales', label: 'Total', field: 'total_cup', align: 'right' },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
];

const isMobile = computed(() => $q.screen.lt.md);
const desktopColumns = columns.map((c) => c.name).filter((name) => name !== 'totales');
const visibleColumns = computed(() =>
  isMobile.value ? ['created_at', 'totales', 'actions'] : desktopColumns,
);

const filteredSales = computed(() => {
  const f = filter.value.trim().toLowerCase();
  if (!f) return sales.value;
  return sales.value.filter(
    (s) =>
      String(s.id).includes(f) ||
      (s.token || '').toLowerCase().includes(f),
  );
});

function saleTypeLabel(sale: Sale): string {
  return sale.order_id ? 'Pedido' : 'Venta';
}

function saleTypeColor(sale: Sale): string {
  return sale.order_id ? 'green-7' : 'blue-7';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('es-CU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatPrice(val?: number | null, currency?: string | null): string {
  if (val == null) return '—';
  return formatPriceUtil(val, currency);
}

function paymentCurrency(method: string): string {
  if (method === 'efectivo_usd' || method === 'zelle') return 'USD';
  if (method === 'euro') return 'EUR';
  return 'CUP';
}

function paymentsSummary(saleId: number): string {
  const list = payments.value.filter((p) => p.sale_id === saleId);
  if (!list.length) return '—';
  return list
    .map((p) => {
      const c = paymentCurrency(p.method);
      return c === 'CUP' ? `${p.method} ${formatPriceUtil(p.amount, 'CUP')}` : `${p.method} ${p.amount} ${c}`;
    })
    .join(' · ');
}

function totalItems(saleId: number): number {
  return products.value
    .filter((p) => p.sale_id === saleId)
    .reduce((acc, p) => acc + p.qty, 0);
}

function openDetail(sale: Sale) {
  detailSale.value = sale;
  detailOpen.value = true;
}

function onRowClick(_evt: Event, row: Sale) {
  if (!isMobile.value) return;
  openDetail(row);
}

function openAnular(sale: Sale) {
  anularSale.value = sale;
  anularNote.value = '';
  anularError.value = '';
  anularOpen.value = true;
}

async function confirmAnular() {
  if (!anularSale.value || !anularNote.value.trim()) return;
  anularLoading.value = true;
  anularError.value = '';
  const res = await anularVenta(anularSale.value.id, anularNote.value.trim());
  anularLoading.value = false;
  if (res.success) {
    anularOpen.value = false;
    $q.notify({
      message: 'Venta anulada correctamente',
      color: 'positive',
      icon: 'check_circle',
      timeout: 2000,
    });
    await load();
  } else {
    anularError.value = res.error || 'Error al anular la venta';
    $q.notify({
      message: res.error || 'Error al anular la venta',
      color: 'negative',
      icon: 'error',
    });
  }
}

async function load() {
  const negocioId = getAdminBusinessId();
  if (!negocioId) return;
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('negocio_id', negocioId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    sales.value = (data || []) as Sale[];

    const ids = sales.value.map((s) => s.id);
    payments.value = [];
    products.value = [];
    if (ids.length) {
      const [py, pr] = await Promise.all([
        supabase.from('sale_payments').select('*').in('sale_id', ids),
        supabase.from('sale_products').select('*').in('sale_id', ids),
      ]);
      if (py.error) throw py.error;
      if (pr.error) throw pr.error;
      payments.value = (py.data || []) as SalePaymentRow[];
      products.value = (pr.data || []) as SaleProductRow[];
    }
  } catch (e) {
    console.error('Error cargando ventas:', e);
    $q.notify({
      message: 'Error cargando ventas',
      color: 'negative',
      icon: 'error',
    });
  } finally {
    loading.value = false;
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

.products-table {
  thead tr {
    th {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  tbody tr {
    background: #FFFFFF;

    &:nth-child(even) {
      background: #FBF5EE;
    }

    &:hover {
      background: #F5EDE2;
    }
  }

  td {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.85rem;
  }

  .q-table__middle {
    border-radius: 0;
  }
}

@media (max-width: 1023.98px) {
  .products-table .q-btn {
    min-width: 44px;
    min-height: 44px;
  }
}
</style>