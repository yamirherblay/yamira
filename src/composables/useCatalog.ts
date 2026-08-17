import { ref, computed } from 'vue';
import type { Product } from 'src/stores/types';

export function useCatalog(initialProducts: Product[] = []) {
  const products = ref<Product[]>(initialProducts);
  const selectedCategory = ref<string>('all');
  const searchQuery = ref<string>('');

  const categories = computed(() => {
    const set = new Set<string>();
    products.value.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return [
      { key: 'all', label: 'Todos' },
      ...Array.from(set)
        .sort()
        .map((c) => ({ key: c, label: capitalize(c) })),
    ];
  });

  const filteredProducts = computed(() => {
    let filtered = products.value.filter((p) => p.estado !== 'Agotado');

    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory.value);
    }

    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.descripcion?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query),
      );
    }

    return filtered;
  });

  const stats = computed(() => ({
    total: products.value.length,
    available: products.value.filter((p) => p.estado === 'Disponible').length,
    onOffer: products.value.filter((p) => p.oferta).length,
  }));

  function setProducts(newProducts: Product[]) {
    products.value = newProducts;
  }

  function selectCategory(key: string) {
    selectedCategory.value = key;
    searchQuery.value = '';
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  function capitalize(s: string): string {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return {
    products,
    selectedCategory,
    searchQuery,
    categories,
    filteredProducts,
    stats,
    setProducts,
    selectCategory,
    setSearchQuery,
  };
}
