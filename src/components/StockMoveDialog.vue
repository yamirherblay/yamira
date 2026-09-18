<template>
  <q-dialog v-model="show" persistent>
    <q-card style="max-width: 450px; width: 100%;">
      <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
        <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
          {{ dialogTitle }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense @click="close" />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <div v-if="product" class="q-mb-md">
          <div>
            <div class="text-weight-medium">{{ product.name }}</div>
            <div class="text-caption text-grey-7">
              Stock actual: {{ product.stock?.qty_available ?? 0 }}
              <span v-if="type === 'dano'"> | Dañado: {{ product.stock?.qty_damaged ?? 0 }}</span>
            </div>
          </div>
        </div>

        <q-input
          v-model.number="qty"
          :label="qtyLabel"
          type="number"
          outlined
          dense
          :min="qtyMin"
          :max="qtyMax"
          :hint="qtyHint"
          class="q-mb-md"
          autofocus
        />

        <q-input
          v-model="note"
          :label="noteLabel"
          outlined
          dense
          type="textarea"
          rows="2"
          :hint="type === 'ajuste' ? 'Obligatoria para justificar el ajuste' : undefined"
        />

        <div v-if="errorMsg" class="text-negative text-caption q-mt-sm">
          {{ errorMsg }}
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancelar" color="grey-7" @click="close" />
        <q-btn
          :label="btnLabel"
          :color="btnColor"
          :loading="processing"
          :disable="!isValid"
          no-caps
          @click="submit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { InventoryProduct, StockMoveType } from 'src/stores/types';
import { useInventoryStore } from 'src/stores/inventory';

const inventoryStore = useInventoryStore();

const props = defineProps<{
  modelValue: boolean;
  product: InventoryProduct | null;
  type: StockMoveType;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  submitted: [];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const qty = ref<number | null>(null);
const note = ref('');
const errorMsg = ref('');
const processing = ref(false);

const typeConfig: Record<
  StockMoveType,
  { title: string; icon: string; color: string; btnLabel: string; btnColor: string }
> = {
  entrada: {
    title: 'Entrada de inventario',
    icon: 'add_circle',
    color: 'green-7',
    btnLabel: 'Registrar entrada',
    btnColor: 'green-7',
  },
  salida: {
    title: 'Salida de inventario',
    icon: 'remove_circle',
    color: 'orange-8',
    btnLabel: 'Registrar salida',
    btnColor: 'orange-8',
  },
  devolucion: {
    title: 'Devolución',
    icon: 'replay',
    color: 'blue-7',
    btnLabel: 'Registrar devolución',
    btnColor: 'blue-7',
  },
  dano: {
    title: 'Producto dañado',
    icon: 'warning',
    color: 'red-5',
    btnLabel: 'Registrar daño',
    btnColor: 'red-5',
  },
  ajuste: {
    title: 'Ajuste de inventario',
    icon: 'tune',
    color: 'primary',
    btnLabel: 'Aplicar ajuste',
    btnColor: 'primary',
  },
};

const config = computed(() => typeConfig[props.type]);

const dialogTitle = computed(() => config.value.title);
const btnLabel = computed(() => config.value.btnLabel);
const btnColor = computed(() => config.value.btnColor);

const qtyLabel = computed(() => {
  if (props.type === 'ajuste') return 'Diferencia (+ o -)';
  return 'Cantidad';
});

const noteLabel = computed(() =>
  props.type === 'ajuste' ? 'Nota (obligatoria)' : 'Nota (opcional)',
);

const qtyMax = computed(() => {
  if (props.type === 'salida' || props.type === 'dano') {
    return props.product?.stock?.qty_available ?? 0;
  }
  return undefined;
});

const qtyMin = computed(() => {
  if (props.type === 'ajuste') {
    return -(props.product?.stock?.qty_available ?? 0);
  }
  const current = props.product?.stock?.qty_available ?? 0;
  return current > 0 ? 1 : 0;
});

const qtyHint = computed(() => {
  if (props.type === 'ajuste') {
    const current = props.product?.stock?.qty_available ?? 0;
    return `Stock actual: ${current}. Resultado: ${current + (qty.value ?? 0)}`;
  }
  if (props.type === 'salida' || props.type === 'dano') {
    return `Máximo disponible: ${qtyMax.value}`;
  }
  return undefined;
});

const isValid = computed(() => {
  if (qty.value === null || qty.value === 0) return false;
  if (props.type === 'ajuste') {
    if (!note.value.trim()) return false;
    if (qty.value < qtyMin.value) return false;
  } else if (qty.value < 1) {
    return false;
  }
  if ((props.type === 'salida' || props.type === 'dano') && qty.value > (qtyMax.value ?? 0)) {
    return false;
  }
  return true;
});

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      qty.value = null;
      note.value = '';
      errorMsg.value = '';
    }
  },
);

function close() {
  show.value = false;
}

async function submit() {
  if (!props.product || !isValid.value) return;

  processing.value = true;
  errorMsg.value = '';

  const result = await inventoryStore.processMove(
    props.product.id,
    props.type,
    qty.value!,
    note.value.trim() || undefined,
  );

  processing.value = false;

  if (result.success) {
    close();
    emit('submitted');
  } else {
    errorMsg.value = result.error || 'Error al procesar el movimiento';
  }
}
</script>
