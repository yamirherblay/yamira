<template>
  <div v-if="showMarquee" class="marquee-bar" :class="{ absolute }">
    <div class="marquee-content column items-center q-gutter-xs">
      <q-btn
        v-if="showButton && buttonLabel"
        dense
        flat
        class="bg-grey-10 text-gold"
        @click="$emit('button-click')"
      >{{ buttonLabel }}</q-btn>
      <div class="marquee-track">
        <span>{{ message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  showButton?: boolean;
  buttonLabel?: string;
  absolute?: boolean;
  showMarquee?: boolean;
}>();

defineEmits<{
  (e: 'button-click'): void;
}>();
</script>

<style scoped>
.marquee-bar {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background: #241A24;
  color: #C98A3D;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  z-index: 2;
}
.marquee-bar.absolute {
  position: absolute;
}

.marquee-track {
  white-space: nowrap;
  display: inline-block;
  padding-left: 100%;
  font-weight: 500;
  font-size: 0.95rem;
  animation: marquee-scroll 15s linear infinite;
}

@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    padding-left: 0;
  }
}
</style>
