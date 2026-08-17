<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nada aqui...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Ir a Inicio"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeta } from 'quasar';

useMeta({
  title: '404 | Página no encontrada',
  meta: {
    robots: { name: 'robots', content: 'noindex, nofollow' },
  },
});
</script>
