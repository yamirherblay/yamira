<template>
  <q-footer class="bg-primary text-white" bordered>
    <q-toolbar class="q-py-md q-px-md">
      <div class="row items-center justify-between full-width q-col-gutter-md">
        <div class="row items-center q-gutter-sm">
          <q-img
            :src="logo"
            :alt="brand"
            style="width: 44px; height: auto;"
          />
          <div>
            <div class="text-weight-bold" style="font-family: 'Rubik', sans-serif; letter-spacing: 2px; font-size: 1rem;">{{ brand }}</div>
            <div class="text-caption text-grey-4" style="letter-spacing: 1px;">TODO A TU ALCANCE</div>
          </div>
        </div>

        <div class="row items-center q-gutter-xs">
          <q-btn flat round dense icon="home" to="/" :aria-label="'Ir a inicio'" color="white" />
          <q-btn
            v-if="phone"
            flat
            round
            dense
            icon="call"
            :href="`tel:${phone}`"
            :aria-label="`Llamar al ${phone}`"
            color="white"
          />
          <q-btn
            v-if="email"
            flat
            round
            dense
            icon="email"
            :href="`mailto:${email}`"
            aria-label="Enviar correo"
            color="white"
          />
          <q-btn
            v-if="whatsapp"
            flat
            round
            dense
            icon="fa-brands fa-whatsapp"
            :href="`https://wa.me/${whatsapp}`"
            target="_blank"
            aria-label="WhatsApp"
            color="white"
          />
        </div>
      </div>
    </q-toolbar>
    <div class="text-center q-py-sm" style="color: #C98A3D; letter-spacing: 8px; font-size: 1rem;">
      ★ ★ ★
    </div>
    <div class="q-px-md q-py-xs text-caption text-center text-grey-4">
      <router-link to="/contacto" class="text-grey-4" style="text-decoration: none;">Contacto</router-link>
      <span class="q-mx-sm">·</span>
      <router-link to="/acerca" class="text-grey-4" style="text-decoration: none;">Acerca</router-link>
      <span class="q-mx-sm">·</span>
      <router-link to="/login" class="text-grey-4" style="text-decoration: none;">Admin</router-link>
    </div>
    <div class="q-px-md q-py-sm text-caption text-center text-grey-5">
      © {{ year }} {{ brand }} — Todos los derechos reservados.
    </div>
  </q-footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import logo from 'src/assets/logo.png';

interface Props {
  brand?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
}

const props = withDefaults(defineProps<Props>(), {
  brand: 'Y4Y Yamira',
  phone: '',
  email: '',
  whatsapp: '',
});

const year = computed(() => new Date().getFullYear());
const { brand, phone, email, whatsapp } = props;
</script>
