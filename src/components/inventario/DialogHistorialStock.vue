<template>
  <q-dialog v-model="show">
    <q-card style="max-width: 600px; width: 100%;">
      <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
        <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
          Historial de {{ product?.name }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-table
          :rows="moves"
          :columns="columns"
          flat
          row-key="id"
          :loading="loading"
          :pagination="{ rowsPerPage: 0 }"
          hide-bottom
          :header-cell-style="headerCellStyle"
          loading-label="Cargando historial..."
          no-data-label="Sin movimientos registrados."
          class="products-table"
        >
          <template #body-cell-created_at="props">
            <q-td :props="props">
              <span class="text-caption">{{ formatDate(props.row.created_at) }}</span>
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
              <span :class="{ 'text-grey-7': props.row.qty < 0 }">
                {{ props.row.qty > 0 ? '+' + props.row.qty : props.row.qty }}
              </span>
            </q-td>
          </template>

          <template #body-cell-note="props">
            <q-td :props="props">
              <span class="note-ellipsis text-caption text-grey-7" :title="props.row.note || ''">
                {{ props.row.note || '—' }}
              </span>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { supabase } from 'boot/supabase';
import type { InventoryProduct, StockMove, StockMoveType } from 'src/stores/types';

const props = defineProps<{
  modelValue: boolean;
  product: InventoryProduct | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const $q = useQuasar();

const moves = ref<StockMove[]>([]);
const loading = ref(false);

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
  { name: 'created_at', label: 'Fecha', field: 'created_at', align: 'left' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
  { name: 'qty', label: 'Cantidad', field: 'qty', align: 'center' },
  { name: 'note', label: 'Nota', field: 'note', align: 'left' },
];

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
    salida: 'blue-7',
    devolucion: 'purple-4',
    ajuste: 'orange-8',
    dano: 'red-5',
  };
  return colors[type] ?? 'grey-7';
}

async function load() {
  if (!props.product) return;
  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('stock_moves')
      .select('*')
      .eq('product_id', props.product.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    moves.value = (data || []) as StockMove[];
  } catch (e) {
    console.error('Error cargando historial:', e);
    moves.value = [];
    $q.notify({
      message: 'Error cargando el historial de stock',
      color: 'negative',
      icon: 'error',
    });
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) void load();
  },
);
</script>

<style lang="scss">
.note-ellipsis {
  display: block;
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.products-table {
  thead tr th {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  tbody tr {
    background: #FFFFFF;

    &:nth-child(even) {
      background: #FBF5EE;
    }
  }

  td {
    font-family: 'Nunito Sans', sans-serif;
    font-size: 0.85rem;
  }
}
</style>