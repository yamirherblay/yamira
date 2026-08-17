<template>
  <q-layout view="lHh Lpr lff" :class="{ 'clear-layout': isClothStore }">
    <q-header class="bg-primary" elevated color="white">
      <q-toolbar>
        <q-toolbar-title class="row items-center q-mr-md">
          <q-btn
            flat
            class="lt-md"
            @click="leftDrawerOpen = !leftDrawerOpen"
            round
            dense
            icon="menu"
          />
          <div v-if="!showSearch">
            <span>Mercado Texas</span>
          </div>
        </q-toolbar-title>
        <!-- Desktop navigation (hidden on small screens) -->
        <div class="row items-center gt-sm q-gutter-x-xs">
          <q-btn flat dense label="" to="/" icon="home" class="gt-xs" />
          <q-btn flat dense label="Mercado" to="/tienda" icon="store" class="gt-xs" />
          <q-btn flat dense label="Mayoristas" to="/mayoristas" icon="sell" class="gt-xs" />
          <q-btn
            flat
            dense
            label="Sabrina's Fashion"
            to="/clothStore"
            icon="checkroom"
            class="gt-xs"
          />
          <q-btn flat dense label="Quiénes somos" to="/about" icon="info" class="gt-xs" />
          <q-btn flat dense label="FAQ" to="/faq" icon="help_center" class="gt-xs" />
          <q-btn flat dense label="Contacto" to="/contact" icon="contact_support" class="gt-xs" />
        </div>

        <!-- Actions: Search + Cart -->
        <div class="row items-center no-wrap q-gutter-sm">
          <!-- Toggle search -->
          <div v-show="!showSearch" class="row items-center no-wrap">
            <q-btn flat round dense icon="search" @click="toggleSearch" aria-label="Buscar" />
          </div>
          <!-- Slide-in input to avoid layout deformation -->
          <q-slide-transition>
            <div v-show="showSearch" class="row items-center no-wrap">
              <q-input
                v-model="searchTerm"
                dense
                outlined
                color="white"
                input-class="text-white"
                class="q-ml-xs search-input"
                placeholder="Buscar productos..."
                @keyup.enter="submitSearch"
              >
                <template #append>
                  <q-btn
                    round
                    dense
                    flat
                    color="white"
                    icon="close"
                    @click="clearSearch"
                    :aria-label="'Cerrar'"
                  />
                  <q-btn
                    round
                    dense
                    flat
                    color="white"
                    icon="search"
                    @click="submitSearch"
                    :aria-label="'Buscar'"
                  />
                </template>
              </q-input>
            </div>
          </q-slide-transition>

          <!-- Cart button -->
          <q-btn flat round dense icon="shopping_cart" @click="showCart = true">
            <q-badge color="red" text-color="white" floating v-if="cart.count">{{
              cart.count
            }}</q-badge>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Mobile drawer menu (opens via edge swipe) - present across the whole system -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      bordered
      swipeable
      class="lt-md"
    >
      <q-list padding>
        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/clothStore">
          <q-item-section avatar><q-icon name="checkroom" /></q-item-section>
          <q-item-section>Sabrina's Fashion</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/tienda">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Mercado</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/mayoristas">
          <q-item-section avatar><q-icon name="sell" /></q-item-section>
          <q-item-section>Mayoristas</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/Zelle">
          <q-item-section avatar><q-icon name="currency_exchange" /></q-item-section>
          <q-item-section>Remesas via Zelle</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/about">
          <q-item-section avatar><q-icon name="info" /></q-item-section>
          <q-item-section>Quiénes somos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/faq">
          <q-item-section avatar><q-icon name="help_center" /></q-item-section>
          <q-item-section>Preguntas Frecuentes</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/contact">
          <q-item-section avatar><q-icon name="contact_support" /></q-item-section>
          <q-item-section>Contacto</q-item-section>
        </q-item>
        <q-separator />
        <q-item class="text-center justify-center">
          <q-item-section>
            <q-img src="/images/logo.png" alt="MercadoTexas" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer persistente -->
    <footer-bar />

    <!-- Cart modal -->
    <cart-modal v-model="showCart" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from 'src/stores/cart';
import CartModal from 'src/components/CartModal.vue';
import FooterBar from 'src/components/FooterBar.vue';

const leftDrawerOpen = ref(false);
const showCart = ref(false);
const cart = useCartStore();

// Search state
const showSearch = ref(false);
const searchTerm = ref('');
const router = useRouter();

function toggleSearch() {
  showSearch.value = !showSearch.value;
}
function submitSearch() {
  const q = searchTerm.value.trim();
  // Si estamos en clothStore, buscar en clothes.json y mantenerse en clothStore
  if (isClothStore.value) {
    void router.push({ path: '/clothStore', query: q ? { q } : {} });
  } else {
    void router.push({ path: '/tienda', query: q ? { q } : {} });
  }
}
function clearSearch() {
  searchTerm.value = '';
  showSearch.value = false;

  // Eliminar el parámetro de búsqueda `q` y mantener el resto según la ruta actual
  if (
    route.name === 'tienda' ||
    route.path === '/tienda' ||
    route.name === 'clothStore' ||
    route.path === '/clothStore'
  ) {
    const { ...rest } = route.query as Record<string, string>;
    const currentPath = isClothStore.value ? '/clothStore' : '/tienda';
    void router.replace({ path: currentPath, query: rest });
  }
}

const route = useRoute();
const isClothStore = computed(() => route.name === 'clothStore' || route.path === '/clothStore');
</script>
<style lang="scss" scoped>
.clear-layout {
  background: rgba(176, 146, 243, 0.83);
}

.search-input {
  min-width: 180px;
  width: 26vw;
  max-width: 320px;
}
</style>
