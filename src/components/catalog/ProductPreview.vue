<template>
  <q-dialog
    v-model="isOpen"
    maximized
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="preview-card" flat>
      <q-card-section class="row items-center justify-end q-pa-sm">
        <q-btn icon="close" flat round dense v-close-popup color="white" size="md" />
      </q-card-section>

      <div class="preview-body column items-center justify-center">
        <div class="preview-image-wrap">
          <q-img
            :src="currentProduct?.image || '/images/placeholder.svg'"
            :ratio="1"
            class="preview-image"
          />
        </div>

        <q-btn
          v-if="currentProduct && currentProduct.estado !== 'Agotado'"
          class="preview-add q-mt-lg"
          outline
          size="md"
          icon="shopping_cart"
          label="Añadir al carrito"
          no-caps
          @click="addToCart"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from 'src/stores/cart';
import { useProductPreview } from 'src/composables/useProductPreview';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const cartStore = useCartStore();
const { product, close } = useProductPreview();

const currentProduct = computed(() => product.value);

const isOpen = computed({
  get: () => product.value !== null,
  set: (val) => { if (!val) close(); },
});

function addToCart() {
  if (!product.value) return;
  cartStore.add(product.value);
  $q.notify({
    type: 'info',
    message: `Agregado: ${product.value.name}`,
    timeout: 2000,
  });
  close();
}
</script>

<style lang="scss">
.preview-card {
  background: rgba(58, 14, 56, 0.92);
  backdrop-filter: blur(8px);
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  display: flex;
  flex-direction: column;
}

.preview-body {
  flex: 1;
  padding: 24px;
}

.preview-image-wrap {
  width: 100%;
  max-width: 400px;
  animation: preview-enter 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.preview-image {
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.preview-add {
  border-color: #C98A3D;
  color: #C98A3D;
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 500;
}

@keyframes preview-enter {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
