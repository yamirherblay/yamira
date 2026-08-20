<template>
  <q-btn
    flat
    dense
    round
    icon="receipt_long"
    @click="$router.push({ name: 'admin-pedidos' })"
  >
    <q-badge v-if="pendingCount > 0" color="red-5" text-color="white" floating>
      {{ pendingCount }}
    </q-badge>
    <q-tooltip>Pedidos pendientes</q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOrdersStore } from 'src/stores/orders';

const ordersStore = useOrdersStore();
const pendingCount = computed(() => ordersStore.pendingCount);
</script>
