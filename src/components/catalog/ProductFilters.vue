<template>
  <section class="product-filters">
    <q-scroll-area
      class="cat-scroll rounded-borders"
      :horizontal="true"
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
    >
      <div ref="scrollRowRef" class="row no-wrap q-gutter-sm items-center">
        <div
          v-for="cat in categories"
          :key="cat.key"
          class="cat-item"
          :class="{ 'cat-item--active': selectedCategory === cat.key }"
        >
          <q-chip
            clickable
            :color="selectedCategory === cat.key ? 'secondary' : 'grey-3'"
            :text-color="selectedCategory === cat.key ? 'white' : 'dark'"
            class="q-px-md text-weight-medium"
            @click="onSelect(cat.key)"
          >
            <span>{{ cat.label }}</span>
          </q-chip>
        </div>
      </div>
    </q-scroll-area>
    <div class="cat-fade" aria-hidden="true"></div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue';

const props = defineProps<{
  categories: { key: string; label: string }[];
  selectedCategory: string;
}>();

const emit = defineEmits<{
  (e: 'select', key: string): void;
}>();

const scrollRowRef = ref<HTMLDivElement | null>(null);

function onSelect(key: string) {
  if (key === props.selectedCategory) return;
  emit('select', key);
  void nextTick(() => {
    const active = scrollRowRef.value?.querySelector('.cat-item--active');
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  });
}

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
  height: 52px;
  padding: 0 4px;
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

.cat-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 48px;
  flex-shrink: 0;
}

.cat-item :deep(.q-chip) {
  min-height: 44px;
}

.cat-item--active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 8px;
  right: 8px;
  height: 3px;
  border-radius: 3px;
  background: #C98A3D;
}

.cat-fade {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 44px;
  pointer-events: none;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}
</style>