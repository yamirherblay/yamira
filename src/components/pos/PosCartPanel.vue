<template>
  <q-card-section class="q-pa-none">
    <div v-if="header" class="row items-center q-py-sm q-px-md" style="border-bottom: 2px solid #C98A3D;">
      <div class="text-subtitle1 text-weight-bold" style="font-family: 'Nunito Sans', sans-serif; color: #62045C;">
        Carrito
      </div>
      <q-space />
      <q-badge color="primary" :label="cart.count" />
      <q-btn
        v-if="cart.count"
        flat
        round
        dense
        icon="delete_sweep"
        color="grey-7"
        aria-label="Vaciar carrito"
        @click="confirmClear"
      >
        <q-tooltip>Vaciar carrito</q-tooltip>
      </q-btn>
    </div>

    <q-list v-if="cart.items.length" bordered separator class="rounded-borders q-mx-md q-my-md">
      <q-item v-for="it in cart.items" :key="it.product_id">
        <q-item-section>
          <q-item-label class="text-body2">{{ it.name }}</q-item-label>
          <q-item-label caption class="text-grey-7">
            {{ formatPrice(it.price_at_sale, it.currency) }} / u
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row items-center no-wrap q-gutter-sm">
            <q-btn
              flat
              round
              outline
              icon="remove"
              color="grey-7"
              size="md"
              aria-label="Quitar una unidad"
              :disable="it.qty <= 1"
              @click="cart.updateQty(it.product_id, it.qty - 1)"
            />
            <span class="pos-qty" style="font-family: 'JetBrains Mono', monospace; min-width: 28px; text-align: center;">{{ it.qty }}</span>
            <q-btn
              flat
              round
              outline
              icon="add"
              color="grey-7"
              size="md"
              aria-label="Agregar una unidad"
              :disable="it.qty >= it.stock_max"
              @click="cart.updateQty(it.product_id, it.qty + 1)"
            />
            <q-btn
              flat
              round
              size="md"
              icon="close"
              color="negative"
              aria-label="Quitar producto del carrito"
              @click="cart.removeItem(it.product_id)"
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else class="text-grey-6 text-center q-py-xl">
      Carrito vacío. Toca un producto para agregarlo.
    </div>

    <template v-if="cart.items.length">
      <q-separator />

      <div class="q-pa-md">
        <div class="row items-center justify-end q-gutter-sm q-mb-md">
          <div v-for="c in cart.currencies" :key="c" class="text-subtitle1 text-weight-bold" style="color: #62045C;">
            Total {{ c }}: {{ formatPrice(cart.totalByCurrency[c] ?? 0, c) }}
          </div>
        </div>

        <div class="text-caption text-grey-7 q-mb-xs">Pagos</div>
        <PaymentSplitter v-model="paymentsModel" :remaining="remaining">
          <template #footer>
            <div v-if="!covered" class="text-negative text-caption q-mt-sm">
              Falta cubrir el total: {{ missingSummary }}
            </div>
          </template>
        </PaymentSplitter>

        <q-btn
          color="primary"
          icon="point_of_sale"
          label="Cobrar"
          no-caps
          class="full-width q-mt-md"
          :loading="charging"
          :disable="!covered"
          @click="emitSubmit"
          style="font-family: 'Nunito Sans', sans-serif; min-height: 44px;"
        />
      </div>
    </template>
  </q-card-section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import PaymentSplitter from 'src/components/pagos/PaymentSplitter.vue';
import { usePosCartStore } from 'src/stores/posCart';
import type { SalePaymentInput } from 'src/stores/types';
import { formatPrice as formatPriceUtil } from 'src/utils/format';

const props = defineProps<{
  payments: SalePaymentInput[];
  charging?: boolean;
  header?: boolean;
}>();

const emit = defineEmits<{
  'update:payments': [value: SalePaymentInput[]];
  submit: [payments: SalePaymentInput[]];
}>();

const $q = useQuasar();
const cart = usePosCartStore();

const paymentsModel = computed<SalePaymentInput[]>({
  get: () => props.payments,
  set: (v) => emit('update:payments', v),
});

const covered = computed(() =>
  cart.currencies.every((c) => {
    const total = cart.totalByCurrency[c] ?? 0;
    const paid = props.payments
      .filter((p) => p.currency === c)
      .reduce((s, p) => s + p.amount, 0);
    return paid >= total;
  }),
);

const remaining = computed<Record<string, number>>(() => {
  const r: Record<string, number> = {};
  cart.currencies.forEach((c) => {
    const total = cart.totalByCurrency[c] ?? 0;
    const paid = props.payments
      .filter((p) => p.currency === c)
      .reduce((s, p) => s + p.amount, 0);
    r[c] = Math.max(0, total - paid);
  });
  return r;
});

const missingSummary = computed(() => {
  const parts: string[] = [];
  cart.currencies.forEach((c) => {
    const total = cart.totalByCurrency[c] ?? 0;
    const paid = props.payments
      .filter((p) => p.currency === c)
      .reduce((s, p) => s + p.amount, 0);
    if (paid < total) parts.push(formatPriceUtil(total - paid, c));
  });
  return parts.join(' + ');
});

function formatPrice(val?: number | null, currency?: string | null): string {
  if (val == null) return '—';
  return formatPriceUtil(val, currency);
}

function emitSubmit() {
  if (!covered.value || !cart.items.length) return;
  emit('submit', props.payments);
}

function confirmClear() {
  $q.dialog({
    title: 'Vaciar carrito',
    message: 'Se quitarán todos los productos del carrito. ¿Continuar?',
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Vaciar', color: 'negative' },
  }).onOk(() => {
    cart.clearCart();
    paymentsModel.value = [];
  });
}
</script>