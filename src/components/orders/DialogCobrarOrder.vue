<template>
  <q-dialog v-model="show">
    <q-card style="max-width: 460px; width: 100%;">
      <q-card-section class="row items-center q-py-sm" style="border-bottom: 2px solid #C98A3D;">
        <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
          Entregar y cobrar #{{ order?.token.slice(0, 6) }}
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-if="order" class="q-pt-md">
        <div class="row items-center justify-end q-gutter-sm q-mb-md">
          <div v-if="order.total_usd" class="text-body1 text-weight-bold">
            Total USD: {{ formatPrice(order.total_usd, 'USD') }}
          </div>
          <div class="text-subtitle1 text-weight-bold" style="color: #62045C;">
            Total CUP: {{ formatPrice(order.total_cup, 'CUP') }}
          </div>
        </div>

        <div class="text-caption text-grey-7 q-mb-xs">Pagos</div>
        <PaymentSplitter v-model="payments" :remaining="remaining">
          <template #footer>
            <div
              v-if="!covered"
              class="text-negative text-caption q-mt-sm"
            >
              Falta cubrir el total: {{ missingSummary }}
            </div>
          </template>
        </PaymentSplitter>

        <q-btn
          color="primary"
          icon="local_shipping"
          label="Entregar y cobrar"
          no-caps
          class="full-width q-mt-md"
          :loading="charging"
          :disable="!covered"
          @click="confirmar"
          style="font-family: 'Nunito Sans', sans-serif;"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import PaymentSplitter from 'src/components/pagos/PaymentSplitter.vue';
import { useSales } from 'src/composables/useSales';
import type { Order, SalePaymentInput } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

const props = defineProps<{
  modelValue: boolean;
  order: Order | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  completed: [];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const $q = useQuasar();

const { createSaleFromOrder } = useSales();

const payments = ref<SalePaymentInput[]>([]);
const charging = ref(false);

const remaining = computed<Record<string, number>>(() => {
  if (!props.order) return { CUP: 0, USD: 0 };
  const cupPaid = payments.value
    .filter((p) => p.currency === 'CUP')
    .reduce((s, p) => s + p.amount, 0);
  const usdPaid = payments.value
    .filter((p) => p.currency === 'USD')
    .reduce((s, p) => s + p.amount, 0);
  return {
    CUP: Math.max(0, (props.order.total_cup ?? 0) - cupPaid),
    USD: Math.max(0, (props.order.total_usd ?? 0) - usdPaid),
  };
});

const covered = computed(() => {
  if (!props.order) return false;
  const cupTotal = props.order.total_cup ?? 0;
  const usdTotal = props.order.total_usd ?? 0;
  if (cupTotal + usdTotal <= 0) return false;
  const paidCup = payments.value
    .filter((p) => p.currency === 'CUP')
    .reduce((s, p) => s + p.amount, 0);
  const paidUsd = payments.value
    .filter((p) => p.currency === 'USD')
    .reduce((s, p) => s + p.amount, 0);
  return paidCup >= cupTotal && paidUsd >= usdTotal;
});

const missingSummary = computed(() => {
  if (!props.order) return '';
  const parts: string[] = [];
  const cupMissing = (props.order.total_cup ?? 0) - payments.value
    .filter((p) => p.currency === 'CUP')
    .reduce((s, p) => s + p.amount, 0);
  const usdMissing = (props.order.total_usd ?? 0) - payments.value
    .filter((p) => p.currency === 'USD')
    .reduce((s, p) => s + p.amount, 0);
  if (cupMissing > 0) parts.push(formatPriceUtil(cupMissing, 'CUP'));
  if (usdMissing > 0) parts.push(formatPriceUtil(usdMissing, 'USD'));
  return parts.join(' + ');
});

function formatPrice(val?: number | null, currency?: string | null): string {
  if (val == null) return '—';
  return formatPriceUtil(val, currency);
}

async function confirmar() {
  if (!props.order || !covered.value) return;
  charging.value = true;
  try {
    const res = await createSaleFromOrder(props.order.id, payments.value);
    if (res.success) {
      show.value = false;
      emit('completed');
    } else {
      $q.notify({
        message: res.error || 'Error al entregar el pedido',
        color: 'negative',
        icon: 'error',
      });
    }
  } finally {
    charging.value = false;
  }
}

watch(
  () => props.modelValue,
  (v) => {
    if (v) {
      payments.value = [];
      charging.value = false;
    }
  },
);
</script>