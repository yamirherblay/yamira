<template>
  <div>
    <div class="row items-end q-col-gutter-sm q-mb-sm">
      <div class="col-12 col-sm-6">
        <q-select
          v-model="methodOption"
          :options="methodOptions"
          label="Método de pago"
          outlined
          dense
          option-label="label"
        />
      </div>
      <div class="col-6 col-sm-4">
        <q-input v-model.number="amount" type="number" label="Monto" outlined dense :min="0" :max="inputMax" />
      </div>
      <div class="col-6 col-sm-2">
        <q-btn
          color="primary"
          icon="add"
          label="Agregar"
          no-caps
          class="full-width"
          :disable="!canAdd"
          @click="add"
          style="font-family: 'Nunito Sans', sans-serif;"
        />
      </div>
    </div>

    <div v-if="errorMessage" class="text-negative text-caption q-mb-sm">{{ errorMessage }}</div>

    <q-list v-if="payments.length" bordered separator class="rounded-borders q-mb-md">
      <q-item v-for="(p, i) in payments" :key="i">
        <q-item-section>
          <q-item-label>{{ methodLabel(p.method) }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center no-wrap q-gutter-sm">
            <span class="text-weight-medium" style="font-family: 'JetBrains Mono', monospace;">
              {{ formatPrice(p.amount, p.currency) }}
            </span>
            <q-btn flat round dense size="sm" color="negative" icon="close" @click="remove(i)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <slot name="footer" :payments="payments" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SalePaymentInput } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

const props = defineProps<{
  modelValue: SalePaymentInput[];
  remaining?: Record<string, number>;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: SalePaymentInput[]];
  change: [value: SalePaymentInput[]];
}>();

interface MethodOption {
  value: string;
  label: string;
  currency: string;
}

const methodOptions: MethodOption[] = [
  { value: 'efectivo_cup', label: 'Efectivo (CUP)', currency: 'CUP' },
  { value: 'efectivo_usd', label: 'Efectivo (USD)', currency: 'USD' },
  { value: 'transferencia', label: 'Transferencia', currency: 'CUP' },
  { value: 'zelle', label: 'Zelle', currency: 'USD' },
  { value: 'euro', label: 'Euros (EUR)', currency: 'EUR' },
];

const methodOption = ref<MethodOption | undefined>(methodOptions[0]);
const amount = ref<number | null>(null);

const payments = computed<SalePaymentInput[]>({
  get: () => props.modelValue,
  set: (v) => {
    emit('update:modelValue', v);
    emit('change', v);
  },
});

const selectedCurrency = computed(() => methodOption.value?.currency ?? 'CUP');

const maxAmount = computed(() => {
  if (props.remaining === undefined) return Number.POSITIVE_INFINITY;
  return Math.max(0, props.remaining[selectedCurrency.value] ?? 0);
});

const inputMax = computed<number | undefined>(() =>
  Number.isFinite(maxAmount.value) ? maxAmount.value : undefined,
);

const methodAlreadyAdded = computed(
  () => !!methodOption.value && payments.value.some((p) => p.method === methodOption.value!.value),
);

const canAdd = computed(() => {
  const a = amount.value ?? 0;
  return !!methodOption.value && a > 0 && a <= maxAmount.value && !methodAlreadyAdded.value;
});

const errorMessage = computed(() => {
  if (methodAlreadyAdded.value) return 'Ya existe un pago con este método';
  const a = amount.value;
  if (a == null) return '';
  if (a <= 0) return 'Debe ser mayor que 0';
  if (a > maxAmount.value) {
    if (!Number.isFinite(maxAmount.value)) return 'Monto no válido';
    return `No puede superar lo pendiente (${formatPrice(maxAmount.value, selectedCurrency.value)})`;
  }
  return '';
});

function methodLabel(method: string): string {
  return methodOptions.find((m) => m.value === method)?.label ?? method;
}

function add() {
  const opt = methodOption.value;
  if (!opt || (amount.value ?? 0) <= 0) return;
  const list = [...payments.value];
  list.push({ method: opt.value, amount: amount.value!, currency: opt.currency });
  payments.value = list;
  amount.value = null;
}

function remove(i: number) {
  const list = [...payments.value];
  list.splice(i, 1);
  payments.value = list;
}

function clear() {
  payments.value = [];
}

function formatPrice(val: number, c: string): string {
  return formatPriceUtil(val, c);
}

defineExpose({ add, remove, clear });
</script>