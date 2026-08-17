<template>
  <canvas ref="canvasRef" class="hero-rain" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useHeroRain } from 'src/composables/useHeroRain';

const canvasRef = ref<HTMLCanvasElement | null>(null);

useHeroRain(canvasRef, { density: 'medium', goldRatio: 0.15 });
</script>

<style scoped>
.hero-rain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>