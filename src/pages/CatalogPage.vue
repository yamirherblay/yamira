<template>
  <q-page padding class="catalog-page">
    <div class="catalog-title text-center q-mb-lg">CATÁLOGO</div>

    <CatalogView />
  </q-page>
</template>

<script setup lang="ts">
import { CatalogView } from 'src/components/catalog';
import { useMeta } from 'quasar';
import { branding } from 'src/config/branding';

useMeta({
  title: `${branding.name} | Catálogo`,
  meta: {
    description: { name: 'description', content: `Catálogo de productos ${branding.name}` },
    'og:title': { property: 'og:title', content: `${branding.name} | Catálogo` },
    'og:description': { property: 'og:description', content: `Catálogo de productos ${branding.name}` },
    'og:image': { property: 'og:image', content: branding.siteUrl + branding.logo },
    'og:url': { property: 'og:url', content: branding.siteUrl + '/catalogo' },
    'twitter:title': { name: 'twitter:title', content: `${branding.name} | Catálogo` },
    'twitter:description': { name: 'twitter:description', content: `Catálogo de productos ${branding.name}` },
  },
});
</script>

<style scoped>
.catalog-page {
  background: #FBF5EE;
}

.catalog-title {
  font-family: 'Rubik', sans-serif;
  font-size: 1.75rem;
  letter-spacing: 3px;
  color: #241A24;
}
</style>
