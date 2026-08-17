<template>
  <section class="product-filters">
    <q-scroll-area
      class="cat-scroll rounded-borders"
      :horizontal="true"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
    >
      <div class="row no-wrap q-gutter-sm items-center">
        <q-chip
          v-for="cat in categories"
          :key="cat.key"
          clickable
          :color="selectedCategory === cat.key ? 'secondary' : 'grey-3'"
          :text-color="selectedCategory === cat.key ? 'white' : 'dark'"
          class="q-px-md q-py-xs text-weight-medium"
          @click="$emit('select', cat.key)"
        >
          <span>{{ cat.label }}</span>
        </q-chip>
      </div>
    </q-scroll-area>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  categories: { key: string; label: string }[];
  selectedCategory: string;
}>();

defineEmits<{
  (e: 'select', key: string): void;
}>();

const thumbStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.25)',
  width: '4px',
  height: '4px',
};

const barStyle = {
  right: '2px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0,0,0,0.08)',
  width: '4px',
  height: '4px',
};
</script>

<style scoped>
.product-filters {
  position: sticky;
  top: 56px;
  z-index: 10;
}

.cat-scroll {
  height: 56px;
  padding: 6px 4px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.cat-scroll::-webkit-scrollbar {
  height: 6px;
}

.cat-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
