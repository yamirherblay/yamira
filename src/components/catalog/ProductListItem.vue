<template>
  <q-card class="product-list-item">
    <div class="gold-border-top"></div>
    <div class="row no-wrap items-stretch">
      <div class="list-image-col">
        <q-img
          :src="product.image || '/images/placeholder.svg'"
          :ratio="1"
          :alt="product.name"
          class="list-image cursor-pointer"
          @click="preview.open(product)"
        >
          <div v-if="product.oferta && product.estado !== 'Agotado'" class="oferta-ribbon">
            <q-badge color="accent" text-color="white" label="Oferta" class="badge-oferta" />
          </div>
          <div v-if="product.new" class="absolute-top-left q-pa-xs badge-new-wrap">
            <q-badge color="blue" text-color="white" label="NUEVO" class="badge-new" />
          </div>
        </q-img>
      </div>
      <div class="list-info-col col column justify-between q-pa-sm">
        <div>
          <div class="list-title" @click="preview.open(product)">{{ product.name }}</div>
          <div v-if="product.descripcion" class="list-desc ellipsis-3-lines">{{ product.descripcion }}</div>
        </div>
        <div class="row items-center justify-between q-mt-xs">
          <div class="list-price" :class="{ 'price-stacked': product.oferta }">
            <template v-if="product.oferta">
              <span class="old-price">{{ formatPrice(product.price, product.currency) }}</span>
              <span class="sale-price">{{ formatPrice(product.descuento, product.currency) }}</span>
            </template>
            <template v-else>
              <span class="sale-price">{{ formatPrice(product.price, product.currency) }}</span>
            </template>
          </div>
          <q-badge
            :color="product.estado === 'Disponible' ? 'info' : 'negative'"
            :text-color="'white'"
            :label="product.estado"
            class="list-status"
          />
        </div>
        <div class="row items-center justify-end q-gutter-xs q-mt-xs">
          <q-btn
            flat
            round
            dense
            icon="fa-brands fa-whatsapp"
            size="sm"
            class="list-whatsapp"
            @click="$emit('whatsapp', product)"
          />
          <q-btn
            flat
            round
            dense
            icon="shopping_cart"
            size="sm"
            color="primary"
            :disable="product.estado === 'Agotado'"
            @click="$emit('add-to-cart', product)"
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import type { Product } from 'src/stores/types';
import { useProductPreview } from 'src/composables/useProductPreview';
import { formatPrice } from 'src/utils/format';

const preview = useProductPreview();

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: 'whatsapp', product: Product): void;
  (e: 'add-to-cart', product: Product): void;
}>();
</script>

<style scoped>
.product-list-item {
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.product-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.product-list-item:hover .gold-border-top {
  border-image: linear-gradient(90deg, #c98a3d, #d9a45c) 1;
}

.list-image-col {
  width: 110px;
  min-width: 110px;
  overflow: hidden;
}

@media (min-width: 600px) {
  .list-image-col {
    width: 140px;
    min-width: 140px;
  }
}

.list-image {
  height: 100%;
}

.list-info-col {
  min-width: 0;
}

.list-title {
  font-family: 'Rubik', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #241A24;
  line-height: 1.2;
  cursor: pointer;
}

.list-title:hover {
  text-decoration: underline;
}

.list-desc {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-top: 2px;
  color: #4A3F49;
}

.list-price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 400;
  color: #241A24;
}

.list-status {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 2px;
}

.list-whatsapp {
  color: #ffffff;
  background: #128C7E;
}

.price-stacked {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  gap: 2px;
}

.old-price {
  text-decoration: line-through;
  opacity: 0.45;
  color: #dc2626;
  margin-right: 6px;
  font-size: 0.85em;
}

.sale-price {
  font-weight: 600;
  color: #241A24;
}

.badge-oferta,
.badge-new {
  font-family: 'Rubik', sans-serif;
  letter-spacing: 1px;
}

.oferta-ribbon {
  position: absolute;
  top: 1px;
  right: -25px;
  transform: rotate(45deg);
  z-index: 1;
}

.badge-oferta {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 10px;
  border-radius: 2px;
  background: #E8543F;
}

.badge-new-wrap {
  min-width: 0;
}

.badge-new {
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>