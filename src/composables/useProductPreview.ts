import { ref } from 'vue';
import type { Product } from 'src/stores/types';

const product = ref<Product | null>(null);

export function useProductPreview() {
  function open(p: Product) {
    product.value = p;
  }

  function close() {
    product.value = null;
  }

  return { product, open, close };
}
