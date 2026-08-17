<template>
  <q-page class="about-page q-pa-lg">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="about-title text-center q-mb-lg">Y4Y YAMIRA</div>

        <div class="linea-vip q-mx-auto q-mb-lg" style="width: 60px;"></div>

        <div class="about-content">
          <p>Y4Y Yamira es tu tienda de productos variados: electrodomésticos, moda y mucho más, siempre con la garantía de una atención cercana y personalizada.</p>
          <p>Trabajamos con precios en CUP y puedes pedir por WhatsApp, con la comodidad de retiro o envío a domicilio.</p>
          <p>Nuestro compromiso: que todo esté a tu alcance.</p>
        </div>

        <div class="linea-vip q-mx-auto q-my-lg" style="width: 60px;"></div>

        <div class="text-center text-gold" style="letter-spacing: 8px; font-size: 1.2rem;">
          ★ ★ ★
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { branding } from 'src/config/branding';
import { useMeta } from 'quasar';

useMeta({
  title: `Acerca de | ${branding.name}`,
  meta: {
    description: { name: 'description', content: `Conoce ${branding.name}, tu tienda de productos variados con todo a tu alcance.` },
    'og:title': { property: 'og:title', content: `Acerca de | ${branding.name}` },
    'og:description': { property: 'og:description', content: `Conoce ${branding.name}, tu tienda de productos variados con todo a tu alcance.` },
    'og:image': { property: 'og:image', content: branding.siteUrl + branding.logo },
    'og:url': { property: 'og:url', content: branding.siteUrl + '/acerca' },
    'twitter:title': { name: 'twitter:title', content: `Acerca de | ${branding.name}` },
    'twitter:description': { name: 'twitter:description', content: `Conoce ${branding.name}, tu tienda de productos variados con todo a tu alcance.` },
  },
});
</script>

<style scoped>
.about-page {
  background: #FBF5EE;
  min-height: 60vh;
}

.about-title {
  font-family: 'Rubik', sans-serif;
  font-size: 2rem;
  letter-spacing: 4px;
  color: #241A24;
}

.about-content {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #241A24;
}

.about-content p {
  margin-bottom: 1rem;
}

.text-gold {
  color: #C98A3D;
}
</style>
