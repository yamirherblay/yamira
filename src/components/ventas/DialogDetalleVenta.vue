<template>
  <q-dialog v-model="show">
    <q-card style="max-width: 540px; width: 100%;">
      <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
        <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
          Venta #{{ sale?.id }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="sale" class="q-pt-md">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-6">
            <span class="text-caption text-grey-7">Fecha</span>
            <div class="text-body2">{{ formatDate(sale.created_at) }}</div>
          </div>
          <div class="col-6">
            <span class="text-caption text-grey-7">Tipo</span>
            <div>
              <q-badge :label="saleTypeLabel" :color="saleTypeColor" dense />
            </div>
          </div>
          </div>

        <div class="text-caption text-grey-7 q-mb-xs">Productos</div>
        <q-list bordered separator class="rounded-borders q-mb-md">
          <q-item v-for="item in items" :key="item.id">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ item.products?.name || item.id_product }}</q-item-label>
              <q-item-label caption class="text-grey-7">
                {{ item.qty }} × {{ formatPrice(item.price_at_sale, item.products?.currency) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-weight-bold" style="color: #62045C;">
                {{ formatPrice(subtotal(item), item.products?.currency) }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-caption text-grey-7 q-mb-xs">Pagos</div>
        <q-list v-if="payments.length" bordered separator class="rounded-borders q-mb-md">
          <q-item v-for="p in payments" :key="p.id">
            <q-item-section>
              <q-item-label>{{ p.method }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-weight-medium">{{ formatPrice(p.amount, p.currency) }}</div>
            </q-item-section>
          </q-item>
        </q-list>
        <div v-else class="text-caption text-grey-6 q-mb-md">Sin pagos registrados.</div>

        <q-separator />

        <div class="row items-center justify-end q-gutter-sm q-pt-md">
          <div v-if="sale.total_usd" class="text-body1 text-weight-bold">
            Total USD: {{ formatPrice(sale.total_usd, 'USD') }}
          </div>
          <div class="text-subtitle1 text-weight-bold" style="color: #62045C;">
            Total CUP: {{ formatPrice(sale.total_cup, 'CUP') }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';
import type { Sale, SalePaymentRow, SaleProductRow } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

const props = defineProps<{
  modelValue: boolean;
  sale: Sale | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const $q = useQuasar();

const items = ref<SaleProductRow[]>([]);
const payments = ref<SalePaymentRow[]>([]);

const saleTypeLabel = computed(() => (props.sale?.order_id ? 'Pedido' : 'Venta'));
const saleTypeColor = computed(() => (props.sale?.order_id ? 'green-7' : 'blue-7'));

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

function subtotal(item: SaleProductRow): number {
  return (item.price_at_sale ?? 0) * item.qty;
}

async function load() {
  if (!props.sale) return;
  items.value = [];
  payments.value = [];
  try {
    const [it, py] = await Promise.all([
      supabase
        .from('sale_products')
        .select('*, products(name, currency)')
        .eq('sale_id', props.sale.id),
      supabase.from('sale_payments').select('*').eq('sale_id', props.sale.id),
    ]);
    if (it.error) throw it.error;
    if (py.error) throw py.error;
    items.value = (it.data || []) as SaleProductRow[];
    payments.value = (py.data || []) as SalePaymentRow[];
  } catch (e) {
    console.error('Error cargando detalle de venta:', e);
    $q.notify({
      message: 'Error cargando el detalle de la venta',
      color: 'negative',
      icon: 'error',
    });
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) void load();
  },
);
</script>